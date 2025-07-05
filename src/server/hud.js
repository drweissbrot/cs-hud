import { basename, extname, parse } from 'path'
import { readFile } from 'fs/promises'

import resolvePath from 'resolve-path'

import { builtinThemesDirectory, customThemesDirectory } from './helpers/paths.js'
import { fileExists } from './helpers/file-exists.js'
import { getThemeTree } from './settings.js'

const textFormats = [
	'.css',
	'.htm',
	'.html',
	'.js',
	'.json',
	'.jsx',
	'.svg',
	'.ts',
	'.vue',
	'.xml',
]

export const registerHudRoutes = (router) => {
	router.get('/hud/:path*', async (context) => {
		const themeTree = await getThemeTree(context.query.theme)

		const path = decodeURIComponent(
			context.params.path?.trim() || 'index.html',
		)

		// don't serve hidden files
		const pathBasename = basename(path)
		if (pathBasename.startsWith('.')) return context.status = 404

		const body = await concatStaticFileFromThemeTreeRecursively(
			path,
			[],
			themeTree,
		)

		if (! body) return context.status = 404

		context.type = extname(path)

		context.body = Buffer.isBuffer(body[0])
			? Buffer.concat(body)
			: body.join('\n')
	})
}

const concatStaticFileFromThemeTreeRecursively = async (path, concatTree, themeTree) => {
	if (! themeTree.length) {
		if (concatTree.length) return concatTree

		const { dir, ext, name } = parse(path)
		if (ext !== '.vue' || ! `/${path}`.endsWith(`/${name}/${name}.vue`)) return

		return [`
			<!-- generated dynamically -->
			<script src="/hud/${dir}/${name}.js"></script>
			<style src="/hud/${dir}/${name}.css" scoped></style>
			<template src="/hud/${dir}/${name}.html"></template>
		`]
	}

	themeTree = themeTree.slice()
	const theme = themeTree.shift()

	const sanitizedBuiltinPath = sanitizePath(`${builtinThemesDirectory}/${theme}`, path)
	if (! sanitizedBuiltinPath) return

	const parsedBuiltinPath = parse(sanitizedBuiltinPath)
	const builtinAppendPath = `${parsedBuiltinPath.dir}/${parsedBuiltinPath.name}.append${parsedBuiltinPath.ext}`

	const sanitizedCustomPath = sanitizePath(`${customThemesDirectory}/${theme}`, path)
	if (! sanitizedCustomPath) return

	const parsedCustomPath = parse(sanitizedCustomPath)
	const customAppendPath = `${parsedCustomPath.dir}/${parsedCustomPath.name}.append${parsedCustomPath.ext}`

	const encoding = textFormats.includes(parsedBuiltinPath.ext) ? 'utf-8' : null

	if (await fileExists(customAppendPath)) {
		concatTree.unshift(await readFile(customAppendPath, encoding))

		const comment = concatComment(parsedCustomPath, theme, true)
		if (comment) concatTree.unshift(comment)
	}

	if (await fileExists(builtinAppendPath)) {
		concatTree.unshift(await readFile(builtinAppendPath, encoding))

		const comment = concatComment(parsedBuiltinPath, theme, true)
		if (comment) concatTree.unshift(comment)
	}

	if (await fileExists(sanitizedCustomPath)) {
		concatTree.unshift(await readFile(sanitizedCustomPath, encoding))

		const comment = concatComment(parsedCustomPath, theme, false)
		if (comment) concatTree.unshift(comment)

		return concatTree
	}

	if (await fileExists(sanitizedBuiltinPath)) {
		concatTree.unshift(await readFile(sanitizedBuiltinPath, encoding))

		const comment = concatComment(parsedBuiltinPath, theme, false)
		if (comment) concatTree.unshift(comment)

		return concatTree
	}

	return concatStaticFileFromThemeTreeRecursively(path, concatTree, themeTree)
}

const sanitizePath = (root, path) => {
	try {
		return resolvePath(root, path)
	} catch {
		return null
	}
}

const concatComment = (parsedPath, theme, append) => {
	const commentBody = `from theme: ${theme}${append ? ' (append)' : ''}`

	switch (parsedPath.ext) {
		case '.css':
		case '.js':
			return `/* ${commentBody} */`

		case '.htm':
		case '.html':
			return `<!-- ${commentBody} -->`
	}
}
