import { ipcRenderer } from 'electron'
import Vue from 'vue'
import Vuex from 'vuex'
import ConfigPanel from './Components/Config.vue'
import CsgoHud from './Components/Hud.vue'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		primaryTeam: 'Das Deutsche Volk',
		series: [],
		seriesName: {},
		gameState: {
			"map": {
				"mode": "competitive",
				"name": "de_cache",
				"phase": "live",
				"round": 14,
				"team_ct": {
					"score": 8,
					"consecutive_round_losses": 0,
					"timeouts_remaining": 1,
					name: 'ipsum',
					"matches_won_this_series": 0
				},
				"team_t": {
					"score": 6,
					"consecutive_round_losses": 1,
					"timeouts_remaining": 1,
					name: "lorem",
					"matches_won_this_series": 0
				},
				"num_matches_to_win_series": 0,
				"current_spectators": 34,
				"souvenirs_total": 0
			},

			phase_countdowns: {
				phase: 'timeout_ct',
				phase_ends_in: 24.2,
			},

			bomb: {
				state: 'defusing',
				countdown: 7.5,
			},
		},
	},

	getters: {
		primaryTeam: (state) => state.primaryTeam,
		seriesName: (state) => state.seriesName,
		series: (state) => state.series,

		gameState: (state) => state.gameState,
		allplayers: (state) => state.gameState.allplayers,
		bomb: (state) => state.gameState.bomb,
		grenades: (state) => state.gameState.grenades,
		map: (state) => state.gameState.map,
		player: (state) => state.gameState.player,
		round: (state) => state.gameState.round,
		timers: (state) => state.gameState.phase_countdowns,
	},

	mutations: {
		setSeriesData(state, data) {
			state.series = data
		},

		setPrimaryTeam(state, team) {
			state.primaryTeam = team
		},

		setSeriesName(state, seriesName) {
			state.seriesName = seriesName
		},

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

		setSeriesData({ commit }, data) {
			commit('setSeriesData', data)
		},

		setPrimaryTeam({ commit }, team) {
			commit('setPrimaryTeam', team)
		},

		setSeriesName({ commit }, seriesName) {
			commit('setSeriesName', seriesName)
		},
	},
})

window.s = store // TODO

new Vue({
	el: '#app',
	store,
	components: {
		ConfigPanel,
		CsgoHud,
	},
})

ipcRenderer.on('gsi', (event, message) => {
	store.dispatch('mergeGameStateBurst', message)
})

ipcRenderer.on('seriesData', (event, message) => {
	store.dispatch('setSeriesData', message.matches)
	store.dispatch('setPrimaryTeam', message.primaryTeam)
	store.dispatch('setSeriesName', message.seriesName)
})
