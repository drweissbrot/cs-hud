import { gsiState, options, teams } from '/hud/core/state.js'

const getPlainReason = (reason) => {
	// TODO add anything missing
	switch (reason) {
		case 'ct_win_defuse': return 'defuse'
		case 'ct_win_time': return 'time'
		case 't_win_bomb': return 'bomb'

		case 'ct_win_elimination':
		case 't_win_elimination':
			return 'elimination'
	}
}

// NB! This must be called AFTER parseTeams!
export const parseRounds = () => {
	const mpMaxrounds = options['cvars.mp_maxrounds']
	const mpOvertimeMaxrounds = options['cvars.mp_overtime_maxrounds']

	// GSI's map.round_wins resets every overtime, work around that
	const roundNumberOffset = gsiState.map.round <= mpMaxrounds
		? 0
		: mpMaxrounds + Math.floor((gsiState.map.round - mpMaxrounds) / mpOvertimeMaxrounds) * mpOvertimeMaxrounds

	return Object.entries(gsiState.map.round_wins || {}).map(([roundNumber, reason]) => {
		const winningSide = reason.startsWith('ct_win') ? 3 : 2

		return {
			reason,
			winningSide,

			plainReason: getPlainReason(reason),
			roundNumber: Number(roundNumber) + roundNumberOffset,
			winningTeam: teams.find((team) => team.side === winningSide),
		}
	})
}
