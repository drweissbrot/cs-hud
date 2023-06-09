export default {
	props: [
		'position',
		'player',
	],

	computed: {
		isBombActive() {
			return this.player?.bomb?.isActive
		},
	},
}
