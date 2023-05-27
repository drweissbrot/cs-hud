import send from 'koa-send'

import { rootDirectory } from './helpers/root-directory.js'
import { sendStaticFile } from './helpers/send-static-file.js'

export const registerHudRoutes = (router) => {
	router.get('/hud', sendStaticFile('src/hud/index.html'))

	router.get('/hud/:path*', async (context) => {
		try {
			await send(context, context.path.replace(/^\/hud\//, ''), { root: `${rootDirectory}/src/hud` })
		} catch (err) {
			if (err.status === 404) {
				// TODO try every theme in the chain here
				// TODO also .append files
				context.status = 404
			} else {
				throw err
			}
		}
	})
}
