import { additionalState, bombsites, gsiState, options, radars } from '/hud/core/state.js'
import { parseGsiState } from '/hud/core/parse-gsi-state.js'

export const handleState = (body) => {
	console.debug(body)

	Object.assign(additionalState, body.additionalState, { unixTimestamp: body.unixTimestamp })
	Object.assign(bombsites, body.bombsites)
	Object.assign(gsiState, body.gsiState)
	Object.assign(radars, body.radars)

	Object.assign(options, body.options)

	for (const key of Object.keys(options)) {
		if (! body.options.hasOwnProperty(key)) delete options[key]
	}

	parseGsiState()
}
