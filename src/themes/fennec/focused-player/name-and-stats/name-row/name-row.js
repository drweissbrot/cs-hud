import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	computed: {
		player() {
			return this.$players.focused
		},

		colorClass() {
			return teamColorClass(this.player.team)
		},
	},
}
