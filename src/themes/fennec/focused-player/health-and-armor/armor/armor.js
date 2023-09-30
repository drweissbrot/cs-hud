import Digits from '/hud/digits/digits.vue'

export default {
	components: {
		Digits,
	},

	computed: {
		player() {
			return this.$players.focused
		},
	},
}
