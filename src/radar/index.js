import * as Vue from '/dependencies/vue.js'
import { bomb, grenades, map, options, players, radars } from '/hud/core/state.js'
import { connectToWebsocket } from '/hud/core/websocket.js'
import { loadModule } from '/dependencies/vue3-sfc-loader.js'
import { sfcLoaderOptions } from '/dependencies/vue3-sfc-loader-options.js'

connectToWebsocket()

const app = Vue.createApp({
	template: '<Radar /><SvgFilters />',
})

app.component('Radar', Vue.defineAsyncComponent(() => loadModule('/hud/radar/radar.vue', sfcLoaderOptions)))
app.component('SvgFilters', Vue.defineAsyncComponent(() => loadModule('/hud/svg-filters/svg-filters.vue', sfcLoaderOptions)))

app.config.globalProperties.$bomb = bomb
app.config.globalProperties.$grenades = grenades
app.config.globalProperties.$map = map
app.config.globalProperties.$opts = options
app.config.globalProperties.$players = players
app.config.globalProperties.$radars = radars

app.mount('#app')
