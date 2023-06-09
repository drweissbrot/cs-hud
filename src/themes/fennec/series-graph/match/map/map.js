import Name from '/hud/series-graph/match/map/name/name.vue'
import Pick from '/hud/series-graph/match/map/pick/pick.vue'
import PickTeam from '/hud/series-graph/match/map/pick-team/pick-team.vue'

export default {
	props: [
		'match',
	],

	components: {
		Name,
		Pick,
		PickTeam,
	},
}
