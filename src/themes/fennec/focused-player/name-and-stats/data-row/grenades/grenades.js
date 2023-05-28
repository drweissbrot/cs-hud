export default {
	computed: {
		player() {
			return this.$players.focused
		},

		grenades() {
			return this.player.grenades.map((grenade) => ({
				iconUrl: `/hud/img/weapons/${grenade.name.substring(7)}.svg`,
				isActive: grenade.isActive,
			}))
		},
	},
}
