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

			const mapNumbers = new Set()

			for (const key of Object.keys(this.$opts)) {
				if (key.startsWith('series.maps.')) mapNumbers.add(key.substring(12).split('.', 2)[0])
			}

			return mapNumbers.size > 1
		},
	}
}
