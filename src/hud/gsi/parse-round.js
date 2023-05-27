import { gsiState } from '/hud/core/state.js'

export const parseRound = () => ({
	phase: gsiState.phase_countdowns.phase,
	phaseEndsInSec: Number(gsiState.phase_countdowns.phase_ends_in),
	roundNumber: gsiState.map.round,
})
