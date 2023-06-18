import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	props: [
		'position',
		'team',
	],

	computed: {
		colorClass() {
			return teamColorClass(this.team)
		},

		positionClass() {
			return `--${this.position}`
		},

		isRoundWinnerPanelActive() {
			return (this.$round.phase === 'over' && this.$round.winningSide === this.team.side)
			// TODO configurable
			// || (this.$round.isFreezetime && this.$rounds[this.$rounds.length - 1].winningSide === this.team.side)
		},
	},
}
