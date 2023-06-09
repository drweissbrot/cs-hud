export default {
	props: [
		'position',
		'player',
	],

	computed: {
		iconUrl() {
			return `/hud/img/weapons/${this.player.primary.name.substring(7)}.svg`
		},

		positionClass() {
			return `--${this.position}`
		},
	},
}
