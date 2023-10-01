import { positionClass } from '/hud/helpers/position-class.js'
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

	data() {
		return {
			overlayImageUrl: null,
		}
	},

	mounted() {
		this.setOverlayImageUrl()
	},

	computed: {
		positionClass,

		hasSeriesGraph() {
			if (this.$opts['preferences.seriesGraph.showMapForOnlyMatch']) return true
			return this.seriesMapNumbers().length > 1
		},
	},

	methods: {
		seriesMapNumbers,

		async setOverlayImageUrl() {
			let fetchResponse = await fetch(`/hud/overlay-images/sidebar-${this.position}.webp`).catch(() => null)

			if (! fetchResponse?.ok) {
				fetchResponse = await fetch(`/hud/overlay-images/sidebar-${this.position}.png`).catch(() => null)
			}

			if (! fetchResponse?.ok) {
				fetchResponse = await fetch(`/hud/overlay-images/sidebar-${this.position}.gif`).catch(() => null)
			}

			if (! fetchResponse?.ok) return

			const blob = await fetchResponse.blob()
			this.overlayImageUrl = URL.createObjectURL(blob)
		},
	},
}
