export default {
	computed: {
		player() {
			return this.$players.focused
		},

		isBombActive() {
			return this.player?.weapons?.find((weapon) => weapon.isActive)?.isBomb
		},
	},
}
