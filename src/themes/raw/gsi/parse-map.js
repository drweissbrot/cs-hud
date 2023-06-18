import { gsiState } from '/hud/core/state.js'
import { formatMapName, sanitizeMapName } from '/hud/helpers/format-map-name.js'

export const parseMap = () => ({
	formattedName: formatMapName(gsiState.map.name),
	mode: gsiState.map.mode,
	name: gsiState.map.name,
	phase: gsiState.map.phase,
	sanitizedName: sanitizeMapName(gsiState.map.name),
})
