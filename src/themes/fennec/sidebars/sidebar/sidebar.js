import { seriesMapNumbers } from '/hud/helpers/series-map-numbers.js'
import Player from '/hud/sidebars/sidebar/player/player.vue'
import TeamEquipment from '/hud/sidebars/sidebar/team-equipment/team-equipment.vue'
import TeamGrenades from '/hud/sidebars/sidebar/team-grenades/team-grenades.vue'

export default {
	props: [
		'position',
		'team',
	],

	components: {
		Player,
		TeamEquipment,
		TeamGrenades,
	},

	computed: {
		positionClass() {
			return `--${this.position}`
		},

		hasSeriesGraph() {
			if (this.$opts['preferences.seriesGraph.showMapForOnlyMatch']) return true
			return this.seriesMapNumbers().length > 1
		},
	},

	methods: {
		seriesMapNumbers,
	},
}
