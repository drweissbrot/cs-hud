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
		impulse: null,

		observerSlotSortingEnabled: true,
		prePostMatchAnimationsEnabled: false,
		primaryTeam: null,
		series: [{}],
		seriesName: [],
		seriesNumber: null,

		allplayers: null,
		bomb: null,
		grenades: null,
		map: null,
		phase_countdowns: {},
		player: null,
		round: null,

		// ...require('./__state.js').default, // for debugging

		...(JSON.parse(localStorage.getItem('state') || '{}')),
	},

	getters: {
		cleardata: (state) => state.cleardata,
		impulse: (state) => state.impulse,

		observerSlotSortingEnabled: (state) => state.observerSlotSortingEnabled,
		prePostMatchAnimationsEnabled: (state) => state.prePostMatchAnimationsEnabled,
		primaryTeam: (state) => state.primaryTeam,
		series: (state) => state.series,
		seriesName: (state) => state.seriesName,
		seriesNumber: (state) => state.seriesNumber,

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

		setSeriesNumber(state, seriesNumber) {
			state.seriesNumber = seriesNumber
		},

		setPrePostMatchAnimationsEnabled(state, enabled) {
			state.prePostMatchAnimationsEnabled = enabled
		},

		setObserverSlotSortingEnabled(state, enabled) {
			state.observerSlotSortingEnabled = enabled
		},

		setGameStateKey(state, { key, value }) {
			Vue.set(state, key, value)
		},

		cleardata(state) {
			state.cleardata++
		},

		setImpulse(state, impulse) {
			state.impulse = impulse
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

		async config({ commit }, message) {
			commit('setObserverSlotSortingEnabled', message.observerSlotSortingEnabled)
			commit('setPrePostMatchAnimationsEnabled', message.prePostMatchAnimationsEnabled)
			commit('setPrimaryTeam', message.primaryTeam)
			commit('setSeriesData', message.matches)
			commit('setSeriesName', message.seriesName)
			commit('setSeriesNumber', message.seriesNumber)
		},

		sendImpulse: async ({ commit }, impulse) => {
			await commit('setImpulse', impulse)
			await commit('setImpulse', null)
		},
	},
})

// save the current config on every update
store.subscribe((mutation, state) => {
	if (['setGameStateKey', 'cleardata', 'setImpulse'].includes(mutation.type)) return

	// shallow clone the object so we can clean it up
	state = { ...state }

	// discard everything we don't want to persist across restarts
	delete state.allplayers
	delete state.bomb
	delete state.grenades
	delete state.map
	delete state.phase_countdowns
	delete state.player
	delete state.round

	delete state.cleardata
	delete state.impulse

	localStorage.setItem('state', JSON.stringify(state))
})

if (window.location.hash === '#hud') document.documentElement.classList.add('hud')

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

ipcRenderer.on('config', (event, message) => {
	store.dispatch('config', message)
})

ipcRenderer.on('impulse', (event, impulse) => {
	store.dispatch('sendImpulse', impulse)
})

ipcRenderer.send('request-gsi', {
	win: (window.location.hash === '#config') ? 'config' : 'main',
})
