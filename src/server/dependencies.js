import send from 'koa-send'
import { builtinRootDirectory } from './helpers/paths.js'

export const registerDependencyRoutes = (router) => {
	router.get('/dependencies/vue.js', sendStaticFile('node_modules/vue/dist/vue.esm-browser.js'))
	router.get('/dependencies/vue3-sfc-loader.js', sendStaticFile('node_modules/vue3-sfc-loader/dist/vue3-sfc-loader.esm.js'))
	router.get('/dependencies/vue3-sfc-loader.esm.js.map', sendStaticFile('node_modules/vue3-sfc-loader/dist/vue3-sfc-loader.esm.js.map'))

	router.get('/dependencies/normalize.css', sendStaticFile('node_modules/normalize.css/normalize.css'))

	serveFontsourceFont(router, 'noto-sans')
	serveFontsourceFont(router, 'quantico')

	router.get('/dependencies/vue3-sfc-loader-options.js', sendStaticFile('src/assets/vue3-sfc-loader-options.js'))
}

// NB! Do _not_ use this with user-supplied values for localFile!
const sendStaticFile = (localFile) => async (context) => {
	await send(context, localFile, { root: builtinRootDirectory })
}

const serveFontsourceFont = (router, fontName) => {
	const prefix = `/dependencies/${fontName}/`

	router.get(`${prefix}:path*`, async (context) => {
		await send(context, context.path.substring(prefix.length), { root: `${builtinRootDirectory}/node_modules/@fontsource/${fontName}` })
	})
}
