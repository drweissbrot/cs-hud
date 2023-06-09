import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	props: [
		'position',
		'player',
	],

	computed: {
		colorClass() {
			return this.teamColorClass(this.player.team)
		},

		positionClass() {
			return `--${this.position}`
		},
	},

	methods: {
		teamColorClass,
	},
}
