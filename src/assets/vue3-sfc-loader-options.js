import * as Vue from '/dependencies/vue.js'

// These options are used for vue3-sfc-loader, which enables the entire "inherit and override" model for extensibility in this project.
export const sfcLoaderOptions = {
	moduleCache: {
		vue: Vue,
	},

	getFile: async (url) => {
		const res = await fetch(url)
		if (! res.ok) throw Object.assign(new Error(res.statusText + ' ' + url), { res })

		// #65: this enables using query params
		const pathname = new URL(`${window.location.origin}${url}`).pathname

		return {
			type: pathname.endsWith('.js') ? '.mjs' : undefined, // this allows nested imports within modules
			getContentData: (asBinary) => asBinary ? res.arrayBuffer() : res.text(),
		}
	},

	addStyle: (textContent) => {
		const style = Object.assign(document.createElement('style'), { textContent })
		const ref = document.head.getElementsByTagName('style')[0] || null
		document.head.insertBefore(style, ref)
	},
}
