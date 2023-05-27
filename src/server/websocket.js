import { WebSocketServer, WebSocket } from 'ws'

import { additionalState, gsiState } from './state.js'

export class Websocket {
	constructor(server) {
		this.websocket = new WebSocketServer({ server })

		this.websocket.on('connection', (client) => {
			this.sendState(client)
		})

		// TODO
		setInterval(() => {
			this.broadcastState()
		}, 1000)
	}

	getState() {
		return {
			additionalState,
			gsiState,

			timestamp: new Date(),
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
