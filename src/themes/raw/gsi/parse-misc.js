import { gsiState } from '/hud/core/state.js'

export const parseMisc = () => {
	return {
		currentSpectators: gsiState.map.current_spectators,
		souvenirsTotal: gsiState.map.souvenirs_total,
	}
}
