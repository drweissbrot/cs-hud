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

const getFallbackNameFromSide = (side) => {
	switch (side) {
		case 2: return 'Terrorists'
		case 3: return 'Counter-Terrorists'
	}
}

// NB! This must be called AFTER parsePlayers!
export const parseTeams = () => {
	const makeTeam = (side, gsiTeamObject) => {
		const teamMembers = players.filter((player) => player.side === side)

		const team = {
			side,

			consecutiveRoundLosses: gsiTeamObject.consecutive_round_losses,
			flag: gsiTeamObject.flag,
			matchesWonThisSeries: gsiTeamObject.matches_won_this_series, // TODO we may want to have options override this
			name: gsiTeamObject.name || getFallbackNameFromSide(side),
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
		makeTeam(2, gsiState.map.team_t),
		makeTeam(3, gsiState.map.team_ct),
	].sort((a, b) => a.players[0]?.observerSlot - b.players[0]?.observerSlot)
}
