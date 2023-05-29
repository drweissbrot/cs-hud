import { additionalState, bombsites, gsiState, options, radars } from '/hud/core/state.js'
import { parseGsiState } from '/hud/core/parse-gsi-state.js'

export const onMessage = (msg) => {
	const data = JSON.parse(msg.data)
	console.debug(data)

	Object.assign(additionalState, data.additionalState, { unixTimestamp: data.unixTimestamp })
	Object.assign(bombsites, data.bombsites)
	Object.assign(gsiState, data.gsiState)
	Object.assign(options, data.options)
	Object.assign(radars, data.radars)

	parseGsiState()
}
