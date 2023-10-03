import send from 'koa-send'
import { getSettings } from './settings.js'
import { readJson, writeJson } from './helpers/json-file.js'
import { builtinRootDirectory, userspaceSettingsPath } from './helpers/paths.js'

export const registerConfigRoutes = (router, websocket) => {
	router.get('/', (context) => {
		context.status = 302
		context.redirect('/config')
	})

	router.get('/config/options', async (context) => {
		const { settings } = await getSettings().catch((err) => {
			console.error('Error getting settings', err)
			return { settings: { options: {} } }
		})

		context.body = [
			{
				fallback: 'fennec',
				key: 'theme',
				section: 'Theme',
				type: 'string',
				value: settings.parent,
			},

			...Object.entries(settings.options).map(([key, data]) => ({
				...data,
				key,
				sectionDescription: settings.optionSectionDescriptions?.[data.section],
			})),
		]
	})

	router.get('/config/:path*', async (context) => {
		await send(
			context,
			context.params.path?.trim() || 'index.html',
			{ root: `${builtinRootDirectory}/src/config` },
		)
	})

	router.put('/config/options', async (context) => {
		const settings = await readJson(userspaceSettingsPath)

		if (! settings.options) settings.options = {}

		let wasThemeChanged = false

		for (const [key, value] of Object.entries(context.request.body)) {
			if (key === 'theme') {
				wasThemeChanged = settings.parent !== (value || 'fennec')
				settings.parent = (value || 'fennec')
			} else if (value) {
				if (! settings.options[key]) settings.options[key] = {}
				settings.options[key].value = value
			} else if (settings.options[key]) {
				delete settings.options[key].value
			}
		}

		await writeJson(userspaceSettingsPath, settings)
		await websocket.updateCaches()

		if (wasThemeChanged) websocket.broadcastRefresh()

		context.status = 204
	}),

	router.post('/config/force-hud-refresh', async (context) => {
		websocket.broadcastRefresh()
		context.status = 204
	})
}
