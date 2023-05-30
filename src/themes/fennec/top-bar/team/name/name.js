import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	props: [
		'position',
		'team',
	],

	computed: {
		colorClass() {
			return this.teamColorClass(this.team)
		},

		positionClass() {
			return `--${this.position}`
		},
	},

	methods: {
		teamColorClass,
	},
}
