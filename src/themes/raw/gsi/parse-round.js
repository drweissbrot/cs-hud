import { gsiState } from '/hud/core/state.js'

export const parseRound = () => ({
	isFreezetime: gsiState.round.phase === 'freezetime',
	phase: gsiState.phase_countdowns.phase,
	phaseEndsInSec: Number(gsiState.phase_countdowns.phase_ends_in),
	roundNumber: gsiState.map.round,
})
