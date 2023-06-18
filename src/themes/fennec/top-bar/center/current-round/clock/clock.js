import Digits from '/hud/digits/digits.vue'

export default {
	components: {
		Digits,
	},

	computed: {
		roundEndsInSec() {
			return Math.max(0, Math.ceil(this.$round.phaseEndsInSec))
		},

		clockMinutes() {
			return Math.floor(this.roundEndsInSec / 60)
		},

		clockSeconds() {
			return Math.floor(this.roundEndsInSec % 60)
		},

		isClockRed() {
			if (this.$round.phase === 'freezetime' && ! this.$opts['preferences.topBar.clock.tenSecondsRedInFreezetime']) return false
			if ((this.$round.phase === 'timeout_ct' || this.$round.phase === 'timeout_t') && ! this.$opts['preferences.topBar.clock.tenSecondsRedInTacticalTimeout']) return false
			if (this.$round.phase === 'over' && ! this.$opts['preferences.topBar.clock.tenSecondsRedInRoundRestartDelay']) return false

			return this.clockMinutes === 0
				&& this.clockSeconds <= 10
		},
	},
}
