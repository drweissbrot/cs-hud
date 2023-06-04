import { additionalState, bombsites, gsiState, options, radars } from '/hud/core/state.js'
import { parseGsiState } from '/hud/core/parse-gsi-state.js'

export const handleState = (body) => {
	console.debug(body)

	Object.assign(additionalState, body.additionalState, { unixTimestamp: body.unixTimestamp })
	Object.assign(bombsites, body.bombsites)
	Object.assign(gsiState, body.gsiState)
	Object.assign(options, body.options)
	Object.assign(radars, body.radars)

	parseGsiState()
}
