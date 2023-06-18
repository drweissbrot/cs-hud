import { teamColorClass } from '/hud/helpers/team-color-class.js'
import Digits from '/hud/digits/digits.vue'

export default {
	components: {
		Digits,
	},

	computed: {
		player() {
			return this.$players.focused
		},

		weapon() {
			if (this.player?.primary?.isActive) return this.player.primary
			if (this.player?.secondary?.isActive) return this.player.secondary
		},

		colorClass() {
			return teamColorClass(this.player.team)
		},
	},
}
