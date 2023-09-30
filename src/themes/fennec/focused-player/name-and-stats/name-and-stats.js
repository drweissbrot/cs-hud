import { teamColorClass } from '/hud/helpers/team-color-class.js'
import DataRow from '/hud/focused-player/name-and-stats/data-row/data-row.vue'
import NameRow from '/hud/focused-player/name-and-stats/name-row/name-row.vue'

export default {
	components: {
		DataRow,
		NameRow,
	},

	computed: {
		player() {
			return this.$players.focused
		},

		colorClass() {
			return teamColorClass(this.player.team)
		},
	},
}
