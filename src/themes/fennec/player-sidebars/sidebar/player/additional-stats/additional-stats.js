import Adr from '/hud/player-sidebars/sidebar/player/additional-stats/adr/adr.vue'
import Assists from '/hud/player-sidebars/sidebar/player/additional-stats/assists/assists.vue'
import Deaths from '/hud/player-sidebars/sidebar/player/additional-stats/deaths/deaths.vue'
import Kills from '/hud/player-sidebars/sidebar/player/additional-stats/kills/kills.vue'

export default {
	props: [
		'position',
		'player',
	],

	components: {
		Adr,
		Assists,
		Deaths,
		Kills,
	},

	computed: {
		isActive() {
			// TODO configurable: hide this entirely
			return this.$round.isFreezetime
		},

		positionClass() {
			return `--${this.position}`
		},
	},
}
