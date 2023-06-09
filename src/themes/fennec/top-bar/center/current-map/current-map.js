export default {
	computed: {
		currentMapNumber() {
			const mapNumbers = new Set()

			for (const key of Object.keys(this.$opts)) {
				if (key.startsWith('series.maps.')) mapNumbers.add(key.substring(12).split('.', 2)[0])
			}

			if (mapNumbers.size === 1) return 1

			for (const mapNumber of [...mapNumbers].sort((a, b) => Number(a) - Number(b))) {
				const scoreA = this.$opts[`series.maps.${mapNumber}.pickTeamScore`]
				const scoreB = this.$opts[`series.maps.${mapNumber}.enemyTeamScore`]

				const isFirstMapWithoutScores = !scoreA && !scoreB
				if (isFirstMapWithoutScores) return mapNumber
			}

			return 1
		},

		seriesLength() {
			const mapNumbers = new Set()

			for (const key of Object.keys(this.$opts)) {
				if (key.startsWith('series.maps.')) mapNumbers.add(key.substring(12).split('.', 2)[0])
			}

			return mapNumbers.size
		},
	},
}
