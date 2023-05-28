import { additionalState, gsiState, options } from '/hud/core/state.js'
import { parseGsiState } from '/hud/core/parse-gsi-state.js'

export const onMessage = (msg) => {
	const data = JSON.parse(msg.data)
	console.debug(data)

	Object.assign(additionalState, data.additionalState)
	Object.assign(gsiState, data.gsiState)
	Object.assign(options, data.options)

	parseGsiState()
}
