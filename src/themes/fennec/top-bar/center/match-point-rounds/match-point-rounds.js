import { seriesMapNumbers } from '/hud/helpers/series-map-numbers.js'

export default {
	computed: {
		isMatchPointRoundsActive() {
			// TODO configurable: only show in freezetime
			return this.$round.isFreezetime && this.$round.isOvertime
		},

		isMultipleMapSeries() {
			return this.seriesMapNumbers().length > 1
		},
	},

	methods: {
		seriesMapNumbers,
	},
}
