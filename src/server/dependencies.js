import { sendStaticFile } from './helpers/send-static-file.js'

export const registerDependencyRoutes = (router) => {
	router.get('/dependencies/vue.js', sendStaticFile('node_modules/vue/dist/vue.esm-browser.js'))
	router.get('/dependencies/vue3-sfc-loader.js', sendStaticFile('node_modules/vue3-sfc-loader/dist/vue3-sfc-loader.esm.js'))
	router.get('/dependencies/normalize.css', sendStaticFile('node_modules/normalize.css/normalize.css'))
}
