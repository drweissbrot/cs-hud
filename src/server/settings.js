import { mkdir, readFile, writeFile } from 'fs/promises'

import { merge } from 'lodash-es'

import { themesDirectory, userspaceDirectory, userspaceSettingsPath } from './helpers/paths.js'
import { fileExists } from './helpers/file-exists.js'

export const initSettings = async () => {
	if (await fileExists(userspaceSettingsPath)) return

	await mkdir(userspaceDirectory, { recursive: true })

	await writeJson(userspaceSettingsPath, {
		parent: 'fennec',
	})
}

export const getSettings = async () => {
	const settingsObjects = [await readJson(userspaceSettingsPath)]
	const themeTree = ['userspace']

	while (settingsObjects[settingsObjects.length - 1].parent) {
		themeTree.push(settingsObjects[settingsObjects.length - 1].parent)
		settingsObjects.push(
			await readJson(`${themesDirectory}/${settingsObjects[settingsObjects.length - 1].parent}/theme.json`)
		)
	}

	return {
		themeTree,
		settings: merge({}, ...settingsObjects.reverse()),
	}
}

const writeJson = (path, obj) => writeFile(path, JSON.stringify(obj, null, '\t'))

const readJson = async (path) => {
	const str = await readFile(path, 'utf-8')
	return JSON.parse(str)
}
