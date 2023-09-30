import { gsiState, options } from '/hud/core/state.js'

const getWinningSide = () => {
	switch (gsiState.round?.win_team) {
		case 'T': return 2
		case 'CT': return 3
		default: return undefined
	}
}

export const parseRound = () => {
	const maxrounds = options['cvars.mp_maxrounds']
	const overtimeMaxrounds = options['cvars.mp_overtime_maxrounds']

	const roundNumber = gsiState.map.round + 1 - Number(gsiState.phase_countdowns.phase === 'over')
	const isOvertime = roundNumber > maxrounds

	const roundsInOvertimes = isOvertime ? roundNumber - maxrounds : 0
	const overtimeNumber = isOvertime ? Math.floor((roundsInOvertimes - 1) / overtimeMaxrounds) + 1 : 0
	const matchPointAtScore = isOvertime ? (maxrounds / 2) + (overtimeMaxrounds / 2) + (overtimeNumber - 1) * (overtimeMaxrounds / 2) : Math.floor(maxrounds / 2)

	return {
		isOvertime,
		matchPointAtScore,
		overtimeNumber,
		roundNumber,

		isFreezetime: gsiState.round?.phase === 'freezetime',
		phase: gsiState.phase_countdowns.phase,
		phaseEndsInSec: Number(gsiState.phase_countdowns.phase_ends_in),
		roundNumberInCurrentOvertime: isOvertime ? roundNumber - maxrounds - (overtimeNumber - 1) * overtimeMaxrounds - Number(gsiState.phase_countdowns.phase === 'over') : 0,
		winningSide: getWinningSide(),
	}
}
