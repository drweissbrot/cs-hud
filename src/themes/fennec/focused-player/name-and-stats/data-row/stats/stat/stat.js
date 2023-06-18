import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	props: [
		'type',
	],

	computed: {
		player() {
			return this.$players.focused
		},

		colorClass() {
			return teamColorClass(this.player.team)
		},

		value() {
			switch (this.type) {
				case 'kills': return this.player.kills
				case 'assists': return this.player.assists
				case 'deaths': return this.player.deaths
				case 'adr': return this.player.adr
			}
		},

		label() {
			switch (this.type) {
				case 'kills': return 'K'
				case 'assists': return 'A'
				case 'deaths': return 'D'
				case 'adr': return 'ADR'
			}
		},
	},
}
