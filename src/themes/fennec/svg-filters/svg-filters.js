import FocusedPlayer from '/hud/focused-player/focused-player.vue'
import PlayersAlive from '/hud/players-alive/players-alive.vue'
import PlayerSidebars from '/hud/player-sidebars/player-sidebars.vue'
import SeriesGraph from '/hud/series-graph/series-graph.vue'
import TopBar from '/hud/top-bar/top-bar.vue'

export default {
	data() {
		return {
			colorVariables: [
				'counter-terrorists',
				'terrorists',
			],
		}
	},

	computed: {
		filters() {
			return this.colorVariables.map((variable) => {
				const rgb = getComputedStyle(document.documentElement).getPropertyValue(`--${variable}-rgb`)
				const [r, g, b] = rgb.split(/\D+/).map((n) => Number(n))

				return {
					id: `${variable}-from-white-filter`,
					values: [
						`0 0 0 0 ${r / 255}`,
						`0 0 0 0 ${g / 255}`,
						`0 0 0 0 ${b / 255}`,
						`0 0 0 1 0`,
					].join(' '),
				}
			})
		},
	},
}
