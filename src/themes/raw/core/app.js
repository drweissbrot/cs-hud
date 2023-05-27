import * as Vue from '/dependencies/vue.js'
import { bomb, grenades, gsiState, map, misc, players, round, rounds, teams } from '/hud/core/state.js'
import { connectToWebsocket } from '/hud/core/websocket.js'
import { loadModule } from '/dependencies/vue3-sfc-loader.js'
import { sfcLoaderOptions } from '/hud/core/sfc-loader-options.js'

connectToWebsocket()

const app = Vue.createApp(
	Vue.defineAsyncComponent(() => loadModule('/hud/shell/shell.vue', sfcLoaderOptions)),
)

app.config.globalProperties.$bomb = bomb
app.config.globalProperties.$grenades = grenades
app.config.globalProperties.$gsiState = gsiState
app.config.globalProperties.$map = map
app.config.globalProperties.$misc = misc
app.config.globalProperties.$players = players
app.config.globalProperties.$round = round
app.config.globalProperties.$rounds = rounds
app.config.globalProperties.$teams = teams

app.mount('#app')
