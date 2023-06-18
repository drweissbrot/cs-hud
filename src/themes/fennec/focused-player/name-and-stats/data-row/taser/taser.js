export default {
	computed: {
		player() {
			return this.$players.focused
		},

		isActive() {
			return !! this.player?.taser?.isActive
		},
	},
}
