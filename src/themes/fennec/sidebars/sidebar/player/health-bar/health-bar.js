import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	props: [
		'position',
		'player',
	],

	computed: {
		colorClass() {
			return teamColorClass(this.player.team)
		},

		positionClass() {
			return `--${this.position}`
		},
	},
}
