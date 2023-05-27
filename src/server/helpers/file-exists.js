import { stat } from 'fs/promises'

export const fileExists = async (path) => {
	try {
		await stat(path)
		return true
	} catch (err) {
		if (err.code === 'ENOENT') return false
		throw err
	}
}
