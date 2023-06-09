export default {
	props: [
		'position',
		'player',
	],

	computed: {
		isActive() {
			return this.player === this.$players.focused
		},
	},
}
