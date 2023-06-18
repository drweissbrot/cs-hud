import AdditionalStats from '/hud/sidebars/sidebar/player/additional-stats/additional-stats.vue'
import Adr from '/hud/sidebars/sidebar/player/adr/adr.vue'
import DeadIcon from '/hud/sidebars/sidebar/player/dead-icon/dead-icon.vue'
import Deaths from '/hud/sidebars/sidebar/player/deaths/deaths.vue'
import Equipment from '/hud/sidebars/sidebar/player/equipment/equipment.vue'
import FocusedPlayerHighlight from '/hud/sidebars/sidebar/player/focused-player-highlight/focused-player-highlight.vue'
import Grenades from '/hud/sidebars/sidebar/player/grenades/grenades.vue'
import Health from '/hud/sidebars/sidebar/player/health/health.vue'
import HealthBar from '/hud/sidebars/sidebar/player/health-bar/health-bar.vue'
import Kills from '/hud/sidebars/sidebar/player/kills/kills.vue'
import Money from '/hud/sidebars/sidebar/player/money/money.vue'
import Name from '/hud/sidebars/sidebar/player/name/name.vue'
import ObserverSlot from '/hud/sidebars/sidebar/player/observer-slot/observer-slot.vue'
import Primary from '/hud/sidebars/sidebar/player/primary/primary.vue'
import RoundKills from '/hud/sidebars/sidebar/player/round-kills/round-kills.vue'
import RoundMoneySpent from '/hud/sidebars/sidebar/player/round-money-spent/round-money-spent.vue'
import Secondary from '/hud/sidebars/sidebar/player/secondary/secondary.vue'
import Taser from '/hud/sidebars/sidebar/player/taser/taser.vue'

export default {
	props: [
		'position',
		'player',
	],

	components: {
		AdditionalStats,
		Adr,
		DeadIcon,
		Deaths,
		Equipment,
		FocusedPlayerHighlight,
		Grenades,
		Health,
		HealthBar,
		Kills,
		Money,
		Name,
		ObserverSlot,
		Primary,
		RoundKills,
		RoundMoneySpent,
		Secondary,
		Taser,
	},

	computed: {
		isBombActive() {
			return !! this.player?.bomb?.isActive
		},

		positionClass() {
			return `--${this.position}`
		},

		grenades() {
			let foundPerType = {}

			return this.player.grenades.map((grenade) => {
				foundPerType[grenade.name] = (foundPerType[grenade.name] || 0) + 1

				return {
					iconUrl: `/hud/img/weapons/${grenade.unprefixedName}.svg`,
					isActive: grenade.isActive,
					key: `${grenade.name}${foundPerType[grenade.name]}`,
				}
			})
		},
	},
}
