import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	props: [
		'player',
	],

	computed: {
		colorClass() {
			return this.teamColorClass(this.player.team)
		},
	},

	methods: {
		teamColorClass,
	},
}
