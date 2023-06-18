import { seriesMapNumbers } from '/hud/helpers/series-map-numbers.js'
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
			return this.seriesMapNumbers().length > 1
		},
	},

	methods: {
		seriesMapNumbers,
	},
}
