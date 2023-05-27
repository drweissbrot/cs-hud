import { gsiState } from '/hud/core/state.js'
import { formatMapName } from '/hud/gsi/format-map-name.js'

export const parseMap = () => ({
	formattedName: formatMapName(gsiState.map.name),
	mode: gsiState.map.mode,
	name: gsiState.map.name,
	phase: gsiState.map.phase,
})
