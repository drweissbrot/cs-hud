import { readFile, writeFile } from 'fs/promises'

export const readJson = async (path) => {
	const str = await readFile(path, 'utf-8')
	return JSON.parse(str)
}

export const readJsonIfExists = async (path) => {
	try {
		return await readJson(path)
	} catch (err) {
		if (err.code === 'ENOENT') return {}
		throw err
	}
}

export const writeJson = (path, obj) => writeFile(path, JSON.stringify(obj, null, '\t'))
