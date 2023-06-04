import { handleRefresh } from '/hud/core/websocket-events/refresh.js'
import { handleState } from '/hud/core/websocket-events/state.js'

export const onMessage = (msg) => {
	const { event, body } = JSON.parse(msg.data)

	switch (event) {
		case 'refresh': return handleRefresh(body)
		case 'state': return handleState(body)
	}
}
