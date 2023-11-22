import Corners from '/hud/corners/corners.vue'
import FocusedPlayer from '/hud/focused-player/focused-player.vue'
import PlayersAlive from '/hud/players-alive/players-alive.vue'
import Radar from '/hud/radar/radar.vue'
import SeriesGraph from '/hud/series-graph/series-graph.vue'
import Sidebars from '/hud/sidebars/sidebars.vue'
import SvgFilters from '/hud/svg-filters/svg-filters.vue'
import TopBar from '/hud/top-bar/top-bar.vue'

export default {
	components: {
		Corners,
		FocusedPlayer,
		PlayersAlive,
		Radar,
		SeriesGraph,
		Sidebars,
		SvgFilters,
		TopBar,
	},

	mounted() {
		this.applyCssVariableOverrides()
		this.setScaleFactor()

		window.addEventListener('resize', this.setScaleFactor)
	},

	beforeUnmount() {
		window.removeEventListener('resize', this.setScaleFactor)
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

		setScaleFactor() {
			const calculatedScaleFactor = this.calculateScaleFactor()
			document.documentElement.style.setProperty('--scale-factor', calculatedScaleFactor)
		},

		calculateScaleFactor() {
			const raw = getComputedStyle(document.documentElement).getPropertyValue('--base-scale-factor')
			const baseValue = parseFloat(raw)
			const baseUnit = raw.match(/\D+$/)[0]

			switch (baseUnit) {
				case 'vh': return `${Math.round(window.innerHeight / 100 * baseValue)}px`
				case 'vw': return `${Math.round(window.innerWidth / 100 * baseValue)}px`
				default: return raw
			}
		},
	},
}
