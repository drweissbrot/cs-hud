import FocusedPlayer from '/hud/focused-player/focused-player.vue'
import PlayersAlive from '/hud/players-alive/players-alive.vue'
import SeriesGraph from '/hud/series-graph/series-graph.vue'
import Sidebars from '/hud/sidebars/sidebars.vue'
import SvgFilters from '/hud/svg-filters/svg-filters.vue'
import TopBar from '/hud/top-bar/top-bar.vue'

export default {
	components: {
		FocusedPlayer,
		PlayersAlive,
		SeriesGraph,
		Sidebars,
		SvgFilters,
		TopBar,
	},

	mounted() {
		this.applyCssVariableOverrides()
	},

	methods: {
		applyCssVariableOverrides() {
			for (const [key, value] of Object.entries(this.$opts)) {
				if (! key.startsWith('css.')) continue

				document.documentElement.style.setProperty(
					`--${key.substring(4)}`,
					key.endsWith('-rgb') ? this.getRgbValueFromHex(value) : value,
				)
			}
		},

		getRgbValueFromHex(hex) {
			if (! hex.startsWith('#')) return hex

			hex = hex.substring(1)
			if (hex.length === 3) hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`

			const r = parseInt(hex.substring(0, 2), 16)
			const g = parseInt(hex.substring(2, 4), 16)
			const b = parseInt(hex.substring(4, 6), 16)

			return `${r}, ${g}, ${b}`
		},
	},
}
