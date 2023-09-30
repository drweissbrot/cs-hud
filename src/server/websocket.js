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

		this.updateCaches()
	}

	async updateCaches() {
		const { bombsites, radars, settings } = await getSettings()

		this.bombsitesCache = bombsites
		this.optionsCache = Object.fromEntries(Object.entries(settings.options).map(([key, { fallback, value }]) => [key, value ?? fallback]))
		this.radarsCache = radars

		this.broadcastState()
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

	broadcastToWebsockets(event, body) {
		const message = body !== undefined
			? JSON.stringify({ event, body })
			: JSON.stringify({ event })

		for (const client of this.websocket.clients) {
			if (client.readyState !== WebSocket.OPEN) continue
			client.send(message)
		}
	}

	sendState(client) {
		client.send(JSON.stringify({ event: 'state', body: this.getState() }))
	}

	broadcastState() {
		const state = this.getState()
		this.broadcastToWebsockets('state', state)
	}

	broadcastRefresh() {
		this.broadcastToWebsockets('refresh', {})
	}
}
