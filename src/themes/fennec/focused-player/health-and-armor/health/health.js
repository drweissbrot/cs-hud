import Digits from '/hud/digits/digits.vue'

export default {
	components: {
		Digits,
	},

	computed: {
		player() {
			return this.$players.focused
		},

		red() {
			if (! this.player) return false

			const maxHp = Number(this.$opts['preferences.focusedPlayer.maximumRedHealthPoints'] || 0)
			if (! maxHp) return false

			return this.player.health <= maxHp
		}
	},
}
