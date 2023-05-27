import send from 'koa-send'

export const registerDependencyRoutes = (router) => {
	router.get('/dependencies/vue.js', sendStaticFile('node_modules/vue/dist/vue.esm-browser.js'))
	router.get('/dependencies/vue3-sfc-loader.js', sendStaticFile('node_modules/vue3-sfc-loader/dist/vue3-sfc-loader.esm.js'))

	router.get('/dependencies/normalize.css', sendStaticFile('node_modules/normalize.css/normalize.css'))

	serveFontsourceFont(router, 'quantico')
}

// NB! Do _not_ use this with user-supplied values for localFile!
export const sendStaticFile = (localFile) => async (context) => {
	await send(context, localFile)
}

export const serveFontsourceFont = (router, fontName) => {
	const prefix = `/dependencies/${fontName}/`

	router.get(`${prefix}:path*`, async (context) => {
		await send(context, context.path.substring(prefix.length), { root: `node_modules/@fontsource/${fontName}` })
	})
}
