import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	props: [
		'round',
	],

	computed: {
		colorClass() {
			if (! this.round.winningTeam) return
			return teamColorClass(this.round.winningTeam)
		},

		reasonIconUrl() {
			switch (this.round.plainReason) {
				case 'bomb': return '/hud/img/icons/bomb.svg'
				case 'defuse': return '/hud/img/icons/defuse.svg'
				case 'elimination': return '/hud/img/icons/elimination.svg'
				case 'time': return '/hud/img/icons/time.svg'
			}
		},

		isCurrentRound() {
			return this.round.roundNumber === this.$round.roundNumber
		},
	},
}
