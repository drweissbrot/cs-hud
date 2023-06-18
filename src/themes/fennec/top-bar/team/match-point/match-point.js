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

		isMatchPointPanelActive() {
			return this.$round.isFreezetime && this.team.score === this.$round.matchPointAtScore
		},
	},
}
