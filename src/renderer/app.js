import Vue from 'vue'
import Vuex from 'vuex'
import CsgoHud from './Components/Hud.vue'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		gameState: {},
	},

	getters: {
		gameState: (state) => state.gameState,
		allplayers: (state) => state.gameState.allplayers,
		bomb: (state) => state.gameState.bomb,
		map: (state) => state.gameState.map,
		player: (state) => state.gameState.player,
		round: (state) => state.gameState.round,
		timers: (state) => state.gameState.phase_countdowns,
	},

	mutations: {
		setKey(state, { key, value }) {
			Vue.set(state.gameState, key, value)
		},
	},

	actions: {
		mergeGameStateBurst({ commit }, burst) {
			for (const key in burst) {
				if (key === 'previously' || key === 'added') continue

				commit('setKey', { key, value: burst[key] })
			}
		},
	},
})

window.s = store

new Vue({
	el: '#app',
	store,
	components: {
		CsgoHud,
	},
})

require('electron').ipcRenderer.on('gsi', (event, message) => {
	store.dispatch('mergeGameStateBurst', message)
})
