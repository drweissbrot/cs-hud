import { gsiState, players } from '/hud/core/state.js'

const getGrenadeKey = (weaponName) => {
	switch (weaponName) {
		case 'weapon_decoy': return 'decoy'
		case 'weapon_flashbang': return 'flashbang'
		case 'weapon_hegrenade': return 'hegrenade'
		case 'weapon_smokegrenade': return 'smokegrenade'

		case 'weapon_incgrenade':
		case 'weapon_molotov':
			return 'molotov'
	}
}

export const parseTeams = () => {
	const makeTeam = (side, fallbackName, gsiTeamObject) => {
		const teamMembers = players.filter((player) => player.side === side)

		const team = {
			side,

			consecutiveRoundLosses: gsiTeamObject.consecutive_round_losses,
			flag: gsiTeamObject.flag,
			matchesWonThisSeries: gsiTeamObject.matches_won_this_series,
			name: gsiTeamObject.name || fallbackName,
			players: teamMembers,
			score: gsiTeamObject.score,
			timeoutsRemaining: gsiTeamObject.timeouts_remaining,

			grenades: {
				decoy: 0,
				flashbang: 0,
				hegrenade: 0,
				molotov: 0,
				smokegrenade: 0,
				total: 0,
			},
		}

		for (const player of teamMembers) {
			player.team = team

			for (const grenade of player.grenades) {
				team.grenades.total++
				team.grenades[getGrenadeKey(grenade.name)]++
			}
		}

		return team
	}

	return [
		makeTeam(2, 'Terrorists', gsiState.map.team_t),
		makeTeam(3, 'Counter-Terrorists', gsiState.map.team_ct),
	].sort((a, b) => a.players[0]?.observerSlot - b.players[0]?.observerSlot)
}
