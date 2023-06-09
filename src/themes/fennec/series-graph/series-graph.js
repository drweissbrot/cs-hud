import { formatMapName } from '/hud/gsi/helpers/format-map-name.js'
import Match from '/hud/series-graph/match/match.vue'

export default {
	components: {
		Match,
	},

	computed: {
		// TODO dynamic
		matches() {
			return [
				{
					isCurrentMatch: false,
					isDecider: false,
					mapImageUrl: `/hud/img/maps/de_vertigo.webp`,
					mapName: this.formatMapName('de_vertigo'),
					pickedByTeamName: 'Das Deutsche Volk',
					scores: [16, 12],
				},

				{
					isCurrentMatch: true,
					isDecider: false,
					mapImageUrl: `/hud/img/maps/de_nuke.webp`,
					mapName: this.formatMapName('de_nuke'),
					pickedByTeamName: 'El Kompetente',
				},

				{
					isCurrentMatch: false,
					isDecider: true,
					mapImageUrl: `/hud/img/maps/de_overpass.webp`,
					mapName: this.formatMapName('de_overpass'),
				},
			]
		},
	},

	methods: {
		formatMapName,
	},
}
