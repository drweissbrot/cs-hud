import * as Vue from '/dependencies/vue.js'

export const sfcLoaderOptions = {
	moduleCache: {
		vue: Vue,
	},

	getFile: async (url) => {
		const res = await fetch(url)
		if (!res.ok) throw Object.assign(new Error(res.statusText + ' ' + url), { res })

		return {
			type: url.endsWith('.js') ? '.mjs' : undefined, // this allows nested imports within modules
			getContentData: (asBinary) => asBinary ? res.arrayBuffer() : res.text(),
		}
	},

	addStyle: (textContent) => {
		const style = Object.assign(document.createElement('style'), { textContent })
		const ref = document.head.getElementsByTagName('style')[0] || null
		document.head.insertBefore(style, ref)
	},
}
