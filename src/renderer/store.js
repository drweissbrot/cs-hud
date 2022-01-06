import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		cleardata: 0,
		impulse: null,

		animationsGenericBackgroundVideoPath: null,
		autoplayPostMatchAnimations: false,
		observerSlotSortingEnabled: false,
		postMatchOutroMusicPath: null,
		preMatchIntroMusicPath: null,
		prePostMatchAnimationsEnabled: false,
		primaryTeam: null,
		series: [{}],
		seriesName: [],
		seriesNumber: null,
		tacticalTimeoutMusicPaths: [],

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

		animationsGenericBackgroundVideoPath: (state) => state.animationsGenericBackgroundVideoPath,
		autoplayPostMatchAnimations: (state) => state.autoplayPostMatchAnimations,
		observerSlotSortingEnabled: (state) => state.observerSlotSortingEnabled,
		postMatchOutroMusicPath: (state) => state.postMatchOutroMusicPath,
		preMatchIntroMusicPath: (state) => state.preMatchIntroMusicPath,
		prePostMatchAnimationsEnabled: (state) => state.prePostMatchAnimationsEnabled,
		primaryTeam: (state) => state.primaryTeam,
		series: (state) => state.series,
		seriesName: (state) => state.seriesName,
		seriesNumber: (state) => state.seriesNumber,
		tacticalTimeoutMusicPaths: (state) => state.tacticalTimeoutMusicPaths,

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

		setAutoplayPostMatchAnimations(state, autoplay) {
			state.autoplayPostMatchAnimations = autoplay
		},

		setAnimationsGenericBackgroundVideoPath(state, path) {
			state.animationsGenericBackgroundVideoPath = path
		},

		setPostMatchOutroMusicPath(state, path) {
			state.postMatchOutroMusicPath = path
		},

		setPreMatchIntroMusicPath(state, path) {
			state.preMatchIntroMusicPath = path
		},

		setTacticalTimeoutMusicPaths(state, paths) {
			state.tacticalTimeoutMusicPaths = paths
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
			commit('setAnimationsGenericBackgroundVideoPath', message.animationsGenericBackgroundVideoPath)
			commit('setAutoplayPostMatchAnimations', message.autoplayPostMatchAnimations)
			commit('setObserverSlotSortingEnabled', message.observerSlotSortingEnabled)
			commit('setPostMatchOutroMusicPath', message.postMatchOutroMusicPath)
			commit('setPreMatchIntroMusicPath', message.preMatchIntroMusicPath)
			commit('setPrePostMatchAnimationsEnabled', message.prePostMatchAnimationsEnabled)
			commit('setPrimaryTeam', message.primaryTeam)
			commit('setSeriesData', message.matches)
			commit('setSeriesName', message.seriesName)
			commit('setSeriesNumber', message.seriesNumber)
			commit('setTacticalTimeoutMusicPaths', message.tacticalTimeoutMusicPaths)
		},

		sendImpulse: async ({ commit }, impulse) => {
			await commit('setImpulse', impulse)
			await commit('setImpulse', null)
		},
	},
})

export default store

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
