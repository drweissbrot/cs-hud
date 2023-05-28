export default {
	computed: {
		player() {
			return this.$players.focused
		},

		isActive() {
			return this.player?.weapons?.find((weapon) => weapon.isActive)?.isTaser
		},
	},
}
