import { ipcRenderer } from 'electron'
import Vue from 'vue'
import Vuex from 'vuex'
import ConfigPanel from './Components/Config.vue'
import CsgoHud from './Components/Hud.vue'

Vue.use(Vuex)

const loggedKeys = []

const store = new Vuex.Store({
	state: {
		primaryTeam: 'Das Deutsche Volk',
		series: [],
		seriesName: {},

		allplayers: null,
		bomb: null,
		grenades: null,
		map: null,
		player: null,
		round: null,
		phase_countdowns: {},
	},

	getters: {
		primaryTeam: (state) => state.primaryTeam,
		seriesName: (state) => state.seriesName,
		series: (state) => state.series,

		allplayers: (state) => state.allplayers,
		bomb: (state) => state.bomb,
		grenades: (state) => state.grenades,
		map: (state) => state.map,
		player: (state) => state.player,
		round: (state) => state.round,
		timers: (state) => state.phase_countdowns,
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

		setGameStateKey(state, { key, value }) {
			Vue.set(state, key, value)
		},
	},

	actions: {
		setGameStateKey({ commit }, message) {
			commit('setGameStateKey', message)
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

new Vue({
	el: '#app',
	store,
	components: {
		ConfigPanel,
		CsgoHud,
	},
})

ipcRenderer.on('gsi', (event, message) => {
	store.dispatch('setGameStateKey', message)
})

ipcRenderer.on('seriesData', (event, message) => {
	store.dispatch('setSeriesData', message.matches)
	store.dispatch('setPrimaryTeam', message.primaryTeam)
	store.dispatch('setSeriesName', message.seriesName)
})

ipcRenderer.send('request-gsi', {
	win: (window.location.hash === '#config') ? 'config' : 'main',
})
