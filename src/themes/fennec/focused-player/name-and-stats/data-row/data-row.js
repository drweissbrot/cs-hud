import { teamColorClass } from '/hud/helpers/team-color-class.js'
import BombOrDefuser from '/hud/focused-player/name-and-stats/data-row/bomb-or-defuser/bomb-or-defuser.vue'
import Grenades from '/hud/focused-player/name-and-stats/data-row/grenades/grenades.vue'
import Stats from '/hud/focused-player/name-and-stats/data-row/stats/stats.vue'
import Taser from '/hud/focused-player/name-and-stats/data-row/taser/taser.vue'

export default {
	components: {
		BombOrDefuser,
		Grenades,
		Stats,
		Taser,
	},

	computed: {
		player() {
			return this.$players.focused
		},

		colorClass() {
			return teamColorClass(this.player.team)
		},

		activeWeapon() {
			return this.player?.weapons?.find((weapon) => weapon.isActive)?.name
		},

		grenades() {
			return this.player.grenades.map((grenade) => ({
				iconUrl: `/hud/img/weapons/${grenade.unprefixedName}.svg`,
				isActive: grenade.isActive,
			}))
		},
	},
}
