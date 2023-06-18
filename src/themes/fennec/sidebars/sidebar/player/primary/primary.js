export default {
	props: [
		'position',
		'player',
	],

	computed: {
		iconUrl() {
			return `/hud/img/weapons/${this.player.primary.unprefixedName}.svg`
		},

		positionClass() {
			return `--${this.position}`
		},
	},
}
