export default {
	computed: {
		isMatchPointRoundsActive() {
			// TODO configurable: only show in freezetime
			return this.$round.isFreezetime && this.$round.isOvertime
		},

		isMultipleMapSeries() {
			const mapNumbers = new Set()

			for (const key of Object.keys(this.$opts)) {
				if (key.startsWith('series.maps.')) mapNumbers.add(key.substring(12).split('.', 2)[0])
			}

			return mapNumbers.size > 1
		},
	},
}
