import { seriesMapNumbers } from '/hud/helpers/series-map-numbers.js'

export default {
	computed: {
		isMatchPointRoundsActive() {
			if (this.$opts['preferences.topBar.matchPointRounds.showDuringRound']) {
				return this.$round.isOvertime
			}

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
