import { formatMapName } from '/hud/gsi/helpers/format-map-name.js'
import Match from '/hud/series-graph/match/match.vue'

export default {
	components: {
		Match,
	},

	computed: {
		matches() {
			const mapNumbers = new Set()

			for (const key of Object.keys(this.$opts)) {
				if (key.startsWith('series.maps.')) mapNumbers.add(key.substring(12).split('.', 2)[0])
			}

			const maps = []

			for (const mapNumber of [...mapNumbers].sort((a, b) => Number(a) - Number(b))) {
				const mapName = this.$opts[`series.maps.${mapNumber}.name`]
				const scoreA = this.$opts[`series.maps.${mapNumber}.pickTeamScore`]
				const scoreB = this.$opts[`series.maps.${mapNumber}.enemyTeamScore`]

				const isOnlyMatch = mapNumbers.size === 1
				const isFirstMapWithoutScores = !scoreA && !scoreB && (mapNumber === 1 || maps[maps.length - 1]?.scores)

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
