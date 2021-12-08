import { ipcRenderer } from 'electron'
import Vue from 'vue'
import Vuex from 'vuex'
import ConfigPanel from './Components/Config.vue'
import CsgoHud from './Components/Hud.vue'
import store from './store'

const loggedKeys = []

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
