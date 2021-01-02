import { ipcRenderer } from 'electron'
import Vue from 'vue'
import Vuex from 'vuex'
import ConfigPanel from './Components/Config.vue'
import CsgoHud from './Components/Hud.vue'

Vue.use(Vuex)

const loggedKeys = []

const store = new Vuex.Store({
	state: {
		cleardata: 0,

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
		cleardata: (state) => state.cleardata,

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
		resetGameState(state) {
			state.allplayers = null
			state.bomb = null
			state.grenades = null
			state.map = null
			state.player = null
			state.round = null
			state.phase_countdowns = {}
		},

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

		cleardata(state) {
			state.cleardata++
		},
	},

	actions: {
		resetGameState({ commit }) {
			commit('resetGameState')
			commit('cleardata')
		},

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
	if (message.key === 'player' && message.value.activity === 'menu') store.dispatch('resetGameState')
	else store.dispatch('setGameStateKey', message)
})

ipcRenderer.on('seriesData', (event, message) => {
	store.dispatch('setSeriesData', message.matches)
	store.dispatch('setPrimaryTeam', message.primaryTeam)
	store.dispatch('setSeriesName', message.seriesName)
})

ipcRenderer.send('request-gsi', {
	win: (window.location.hash === '#config') ? 'config' : 'main',
})
