import Digits from '/hud/digits/digits.vue'

export default {
	components: {
		Digits,
	},

	computed: {
		clockMinutes() {
			return Math.floor(this.$round.phaseEndsInSec / 60)
		},

		clockSeconds() {
			return Math.ceil(this.$round.phaseEndsInSec % 60)
		},
	},
}
