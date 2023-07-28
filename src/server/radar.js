import send from 'koa-send'
import { getSettings } from './settings.js'
import { readJson, writeJson } from './helpers/json-file.js'
import { builtinRootDirectory } from './helpers/paths.js'

export const registerRadarRoutes = (router) => {
	router.get('/radar/:path*', async (context) => {
		await send(
			context,
			context.params.path?.trim() || 'index.html',
			{ root: `${builtinRootDirectory}/src/radar` },
		)
	})
}
