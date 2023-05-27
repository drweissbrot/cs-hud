import { gsiState, players } from '/hud/core/state.js'
import { parsePosition } from '/hud/gsi/parse-position.js'

export const parseBomb = () => {
	if (! gsiState.bomb) return {}

	return {
		countdownSec: gsiState.bomb.hasOwnProperty('countdown') ? Number(gsiState.bomb.countdown) : undefined,
		player: gsiState.bomb.player ? players.find((player) => player.steam64Id === gsiState.bomb.player) : undefined,
		position: parsePosition(gsiState.bomb.position),
		state: gsiState.bomb.state,
	}
}
