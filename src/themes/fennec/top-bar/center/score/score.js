import { positionClass } from '/hud/helpers/position-class.js'
import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	props: [
		'position',
		'team',
	],

	computed: {
		positionClass,

		colorClass() {
			return teamColorClass(this.team)
		},
	},
}
