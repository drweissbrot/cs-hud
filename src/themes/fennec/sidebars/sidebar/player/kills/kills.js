import { teamColorClass } from '/hud/helpers/team-color-class.js'
import Digits from '/hud/digits/digits.vue'

export default {
	props: [
		'position',
		'player',
	],

	components: {
		Digits,
	},

	computed: {
		colorClass() {
			return teamColorClass(this.player.team)
		},
	},
}
