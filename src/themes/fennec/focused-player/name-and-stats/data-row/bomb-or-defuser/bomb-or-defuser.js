export default {
	computed: {
		player() {
			return this.$players.focused
		},

		isBombActive() {
			return !! this.player?.bomb?.isActive
		},
	},
}
