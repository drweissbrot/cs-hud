import { gsiState, teams } from '/hud/core/state.js'

const getPlainReason = (reason) => {
	// TODO
	switch (reason) {
		case 'ct_win_defuse': return 'defuse'
		case 't_win_bomb': return 'bomb'

		case 'ct_win_elimination':
		case 't_win_elimination':
			return 'elimination'
	}
}

export const parseRounds = () => {
	// TODO this resets every 30 rounds
	return Object.entries(gsiState.map.round_wins || {}).map(([roundNumber, reason]) => {
		const winningSide = reason.startsWith('ct_win') ? 3 : 2

		return {
			reason,
			winningSide,

			plainReason: getPlainReason(reason),
			roundNumber: Number(roundNumber),
			winningTeam: teams.find((team) => team.side === winningSide),
		}
	})
}
