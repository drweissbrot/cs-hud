export default {
	computed: {
		isMatchPointRoundsActive() {
			// TODO configurable: only show in freezetime
			return this.$round.isFreezetime && this.$round.isOvertime
		},
	},
}
