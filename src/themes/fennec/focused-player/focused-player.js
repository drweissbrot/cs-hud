import FocusedPlayerAmmo from '/hud/focused-player/ammo/ammo.vue'
import FocusedPlayerHealthAndArmor from '/hud/focused-player/health-and-armor/health-and-armor.vue'
import FocusedPlayerNameAndStats from '/hud/focused-player/name-and-stats/name-and-stats.vue'

export default {
	components: {
		FocusedPlayerAmmo,
		FocusedPlayerHealthAndArmor,
		FocusedPlayerNameAndStats,
	},

	data() {
		return {
			overlayBottomImageUrl: null,
		}
	},

	mounted() {
		this.setOverlayBottomImageUrl()
	},

	computed: {
		isActive() {
			return ! this.$round.isFreezetime && this.$players.focused
		},
	},

	methods: {
		async setOverlayBottomImageUrl() {
			let fetchResponse = await fetch('/hud/overlay-images/focused-player-bottom.webp').catch(() => null)

			if (! fetchResponse?.ok) {
				fetchResponse = await fetch('/hud/overlay-images/focused-player-bottom.png').catch(() => null)
			}

			if (! fetchResponse?.ok) {
				fetchResponse = await fetch('/hud/overlay-images/focused-player-bottom.gif').catch(() => null)
			}

			if (! fetchResponse?.ok) return

			const blob = await fetchResponse.blob()
			this.overlayBottomImageUrl = URL.createObjectURL(blob)
		},
	},
}
