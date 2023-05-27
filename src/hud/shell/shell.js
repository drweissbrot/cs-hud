export default {
	data() {
		return {
			bomb: {},
			focusedPlayer: {},
			grenades: [],
			gsiState: {},
			players: [],
			rounds: [],
			teams: [],
		}
	},

	// NB! These are _very_ slow, and when watching a demo with all of these active we can easily end up with a backlog
	// of many seconds (and crashing tabs). You may want to comment out what you're not interested in while you're
	// working.
	watch: {
		$bomb: {
			deep: true,
			handler: function (bomb) {
				this.bomb = {
					...bomb,
					player: bomb.player ? `(${bomb.player.steam64Id})` : undefined,
				}
			},
		},

		$grenades: {
			deep: true,
			handler: function (grenades) {
				this.grenades = grenades.map((grenade) => ({
					...grenade,
					owner: `(${grenade.owner.steam64Id})`,
				}))
			},
		},

		$gsiState: {
			deep: true,
			handler: function (gsiState) {
				this.gsiState = { ...gsiState }
				// delete this.gsiState.allplayers
			},
		},

		$players: {
			deep: true,
			handler: function (players) {
				this.players = players.map((player) => ({
					...player,
					team: `(side ${player.team.side})`,
				}))
			},
		},

		'$players.focused': {
			deep: true,
			handler: function (focusedPlayer) {
				this.focusedPlayer = {
					...focusedPlayer,
					team: `(side ${focusedPlayer.team.side})`,
				}
			},
		},

		$rounds: {
			deep: true,
			handler: function (rounds) {
				this.rounds = rounds.map((round) => ({
					...round,
					winningTeam: `(side ${round.winningTeam.side})`,
				}))
			},
		},

		$teams: {
			deep: true,
			handler: function (teams) {
				this.teams = teams.map((team) => ({
					...team,
					players: team.players.map((p) => p.steam64Id),
				}))
			},
		},
	},
}
