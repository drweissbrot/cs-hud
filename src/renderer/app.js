import Vue from 'vue'

import CsgoHud from './Components/Hud.vue'

const gameState = {}

new Vue({
	el: '#app',
	data: gameState,
	components: {
		CsgoHud,
	},
})

require('electron').ipcRenderer.on('gsi', (event, message) => {
	console.log(message)
})
