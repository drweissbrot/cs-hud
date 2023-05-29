import { WebSocketServer, WebSocket } from 'ws'

import { additionalState, gsiState } from './state.js'
import { getSettings } from './settings.js'

export class Websocket {
	constructor(server) {
		this.websocket = new WebSocketServer({ server })

		this.websocket.on('connection', (client) => {
			this.sendState(client)
		})

		this.bombsitesCache = {}
		this.optionsCache = {}
		this.radarsCache = {}

		setInterval(() => {
			// TODO run this when a value is changed on the config page instead (and maybe on a rare interval or something)
			getSettings().then(({ bombsites, radars, settings }) => {
				this.bombsitesCache = bombsites
				this.optionsCache = Object.fromEntries(Object.entries(settings.options).map(([key, { value }]) => [key, value]))
				this.radarsCache = radars
			})

			this.broadcastState() // TODO just completely remove this (probably)
		}, 5000)
	}

	getState() {
		return {
			additionalState,
			gsiState,

			bombsites: this.bombsitesCache,
			options: this.optionsCache,
			radars: this.radarsCache,
			unixTimestamp: +new Date(),
		}
	}

	broadcastToWebsockets(body) {
		for (const client of this.websocket.clients) {
			if (client.readyState !== WebSocket.OPEN) continue
			client.send(JSON.stringify(body))
		}
	}

	sendState(client) {
		const state = this.getState()
		client.send(JSON.stringify(state))
	}

	broadcastState() {
		const state = this.getState()
		this.broadcastToWebsockets(state)
	}
}
