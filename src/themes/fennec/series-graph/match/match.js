import Map from '/hud/series-graph/match/map/map.vue'
import RoundGraph from '/hud/series-graph/match/round-graph/round-graph.vue'
import Score from '/hud/series-graph/match/score/score.vue'

export default {
	props: [
		'match',
	],

	components: {
		Map,
		RoundGraph,
		Score,
	},
}
