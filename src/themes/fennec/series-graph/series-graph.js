import { formatMapName } from '/hud/helpers/format-map-name.js'
import { seriesMapNumbers } from '/hud/helpers/series-map-numbers.js'
import Match from '/hud/series-graph/match/match.vue'

export default {
	components: {
		Match,
	},

	computed: {
		seriesMapNumbers,

		matches() {
			const maps = []

			for (const mapNumber of this.seriesMapNumbers) {
				const mapName = this.$opts[`series.maps.${mapNumber}.name`]
				const scoreA = this.$opts[`series.maps.${mapNumber}.pickTeamScore`]
				const scoreB = this.$opts[`series.maps.${mapNumber}.enemyTeamScore`]

				const isOnlyMatch = this.seriesMapNumbers.length === 1
				const isFirstMapWithoutScores = ! scoreA && ! scoreB && (mapNumber === 1 || maps[maps.length - 1]?.scores)

				maps.push({
					isOnlyMatch,

					isCurrentMatch: isOnlyMatch || isFirstMapWithoutScores,
					isDecider: this.$opts[`series.maps.${mapNumber}.isDecider`],
					mapImageUrl: `/hud/img/maps/${mapName}.webp`,
					mapName: this.formatMapName(mapName),
					pickedByTeamName: this.$opts[`series.maps.${mapNumber}.pickTeam`],
					scores: scoreA || scoreB ? [scoreA, scoreB] : undefined,
				})
			}

			if (! maps.length) return [{
				isCurrentMatch: true,
				isDecider: false,
				isOnlyMatch: true,
				mapImageUrl: `/hud/img/maps/${this.$map.sanitizedName}.webp`,
				mapName: this.$map.formattedName,
				pickedByTeamName: undefined,
				scores: undefined,
			}]

			if (! maps.some((map) => map.isCurrentMatch)) {
				const mapWithSameName = maps.find((map) => map.mapName === this.$map.formattedName)

				if (mapWithSameName) {
					mapWithSameName.isCurrentMatch = true
				}
			}

			return maps
		},
	},

	methods: {
		formatMapName,
	},
}
