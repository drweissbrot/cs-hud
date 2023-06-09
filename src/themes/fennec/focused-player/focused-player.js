import FocusedPlayerAmmo from '/hud/focused-player/ammo/ammo.vue'
import FocusedPlayerHealthAndArmor from '/hud/focused-player/health-and-armor/health-and-armor.vue'
import FocusedPlayerNameAndStats from '/hud/focused-player/name-and-stats/name-and-stats.vue'

export default {
	components: {
		FocusedPlayerAmmo,
		FocusedPlayerHealthAndArmor,
		FocusedPlayerNameAndStats,
	},

	computed: {
		isActive() {
			return ! this.$round.isFreezetime && this.$players.focused
		},
	},
}
