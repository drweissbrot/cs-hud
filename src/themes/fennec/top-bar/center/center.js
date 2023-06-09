import CurrentMap from '/hud/top-bar/center/current-map/current-map.vue'
import CurrentRound from '/hud/top-bar/center/current-round/current-round.vue'
import Digits from '/hud/digits/digits.vue'
import MapWins from '/hud/top-bar/center/map-wins/map-wins.vue'
import MatchPointRounds from '/hud/top-bar/center/match-point-rounds/match-point-rounds.vue'
import Score from '/hud/top-bar/center/score/score.vue'

export default {
	components: {
		CurrentMap,
		CurrentRound,
		Digits,
		MapWins,
		MatchPointRounds,
		Score,
	},

	computed: {
		isMultipleMapSeries() {
			const mapNumbers = new Set()

			for (const key of Object.keys(this.$opts)) {
				if (key.startsWith('series.maps.')) mapNumbers.add(key.substring(12).split('.', 2)[0])
			}

			return mapNumbers.size > 1
		},
	},
}
