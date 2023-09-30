import { additionalState, bombsites, gsiState, players } from '/hud/core/state.js'
import { findBombsite } from '/hud/gsi/helpers/find-bomb-site.js'
import { parsePosition } from '/hud/gsi/parse-position.js'

export const parseBomb = () => {
	if (! gsiState.bomb) return {}

	const countdownSec = getCountdownSec()
	const isPlanted = ['defusing', 'planted'].includes(gsiState.bomb.state)
	const position = parsePosition(gsiState.bomb.position)

	return {
		countdownSec,
		isPlanted,
		position,

		bombsite: isPlanted && findBombsite(position),
		plantedCountdownSec: getPlantedCountdownSec(countdownSec),
		player: gsiState.bomb.player ? players.find((player) => player.steam64Id === gsiState.bomb.player) : undefined,
		state: gsiState.bomb.state,
	}
}

const getCountdownSec = () => {
	if (gsiState.bomb.hasOwnProperty('countdown')) {
		return Number(gsiState.bomb.countdown)
	}

	// in the ca. half-second between defuses being cut off and the bomb actually exploding, the countdown property is missing -- we want to keep it at 0 though
	if (gsiState.bomb.state === 'planted') {
		return 0
	}
}

const getPlantedCountdownSec = (countdownSec) => {
	if (gsiState.bomb.state === 'planted') return countdownSec

	if (
		! additionalState.lastKnownBombPlantedCountdown?.unixTimestamp
		|| ! additionalState.lastKnownBombPlantedCountdown?.value
		|| ! additionalState.unixTimestamp
	) return

	const secondsSinceLastKnownValue = (additionalState.unixTimestamp - additionalState.lastKnownBombPlantedCountdown.unixTimestamp) / 1000

	return additionalState.lastKnownBombPlantedCountdown?.value - secondsSinceLastKnownValue
}
