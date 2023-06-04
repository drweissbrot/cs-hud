import { mkdir } from 'fs/promises'

import { merge } from 'lodash-es'

import { themesDirectory, userspaceBombsitesPath, userspaceDirectory, userspaceRadarsPath, userspaceSettingsPath } from './helpers/paths.js'
import { fileExists } from './helpers/file-exists.js'
import { readJson, writeJson } from './helpers/json-file.js'

export const initSettings = async () => {
	if (await fileExists(userspaceSettingsPath)) return

	await mkdir(userspaceDirectory, { recursive: true })

	await writeJson(userspaceSettingsPath, {
		parent: 'fennec',
	})
}

export const getSettings = async () => {
	const themeTree = ['userspace']

	const bombsiteObjects = [await readJsonIfExists(userspaceBombsitesPath)]
	const radarObjects = [await readJsonIfExists(userspaceRadarsPath)]
	const settingsObjects = [await readJson(userspaceSettingsPath)]

	while (settingsObjects[settingsObjects.length - 1].parent) {
		themeTree.push(settingsObjects[settingsObjects.length - 1].parent)

		settingsObjects.push(
			await readJson(`${themesDirectory}/${settingsObjects[settingsObjects.length - 1].parent}/theme.json`),
		)

		bombsiteObjects.push(
			await readJsonIfExists(`${themesDirectory}/${settingsObjects[settingsObjects.length - 1].parent}/bombsites.json`),
		)

		radarObjects.push(
			await readJsonIfExists(`${themesDirectory}/${settingsObjects[settingsObjects.length - 1].parent}/radars.json`),
		)
	}

	return {
		themeTree,

		bombsites: merge({}, ...bombsiteObjects.reverse()),
		radars: merge({}, ...radarObjects.reverse()),
		settings: merge({}, ...settingsObjects.reverse()),
	}
}

const readJsonIfExists = async (path) => {
	try {
		return await readJson(path)
	} catch (err) {
		if (err.code === 'ENOENT') return {}
		throw err
	}
}
