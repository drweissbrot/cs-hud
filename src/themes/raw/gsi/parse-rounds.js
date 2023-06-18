import { gsiState, teams } from '/hud/core/state.js'

const getPlainReason = (reason) => {
	// TODO
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
	// GSI's map.round_wins resets every overtime, work around that
	// TODO this may not be based on static 30 and 6, but instead of mp_maxrounds and mp_overtime_maxrounds, need to investigate
	const roundNumberOffset = gsiState.map.round <= 30
		? 0
		: 30 + Math.floor((gsiState.map.round - 30) / 6) * 6

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
