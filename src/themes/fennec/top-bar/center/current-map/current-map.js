import { seriesMapNumbers } from '/hud/helpers/series-map-numbers.js'

export default {
	computed: {
		seriesMapNumbers,

		currentMapNumber() {
			if (this.seriesMapNumbers.length < 2) return 1

			for (const mapNumber of this.seriesMapNumbers) {
				const scoreA = this.$opts[`series.maps.${mapNumber}.pickTeamScore`]
				const scoreB = this.$opts[`series.maps.${mapNumber}.enemyTeamScore`]

				const isFirstMapWithoutScores = ! scoreA && ! scoreB
				if (isFirstMapWithoutScores) return mapNumber
			}

			return 1
		},

		seriesLength() {
			return this.seriesMapNumbers.length
		},
	},
}
