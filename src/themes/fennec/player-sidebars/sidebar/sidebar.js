import Player from '/hud/player-sidebars/sidebar/player/player.vue'

export default {
	props: [
		'position',
		'team',
	],

	components: {
		Player,
	},

	computed: {
		positionClass() {
			return `--${this.position}`
		},
	}
}
