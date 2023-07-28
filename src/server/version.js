import send from 'koa-send'
import { readFile, writeFile } from 'fs/promises'
import { builtinRootDirectory } from './helpers/paths.js'

export const registerVersionRoutes = (router) => {
	router.get('/version', async (context) => {
		await send(context, 'version.txt', { root: `${builtinRootDirectory}/src` })
	})
}
