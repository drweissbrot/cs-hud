import MapName from '/hud/series-graph/match/map/map-name/map-name.vue'
import Pick from '/hud/series-graph/match/map/pick/pick.vue'
import PickTeam from '/hud/series-graph/match/map/pick-team/pick-team.vue'

const fallbackMapImageUrl = '/hud/img/maps/random.webp'

export default {
	props: [
		'match',
	],

	components: {
		MapName,
		Pick,
		PickTeam,
	},

	methods: {
		onError(e) {
			if (e.target && e.target instanceof HTMLImageElement && e.target.getAttribute('src') !== fallbackMapImageUrl) {
				e.target.setAttribute('src', fallbackMapImageUrl)
			}
		}
	}
}
