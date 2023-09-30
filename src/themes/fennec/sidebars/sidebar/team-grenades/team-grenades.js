import { positionClass } from '/hud/helpers/position-class.js'
import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	props: [
		'position',
		'team',
	],

	computed: {
		positionClass,

		colorClass() {
			return teamColorClass(this.team)
		},

		isActive() {
			return ! this.$opts['preferences.sidebar.teamGrenades.hideDuringRound']
				|| this.$round.isFreezetime
				|| (this.$round.phase === 'live' && this.$round.phaseEndsInSec >= (this.$opts['cvars.mp_roundtime'] * 60 - this.$opts['preferences.sidebar.teamGrenades.activeIntoRoundSec']))
		},

		isTotalLabelActive() {
			return this.$opts['preferences.sidebar.teamGrenades.hideDuringRound']
				|| this.$round.isFreezetime
		},

		molotovIconUrl() {
			switch (this.team.side) {
				case 2: return '/hud/img/weapons/molotov.svg'
				case 3: return '/hud/img/weapons/incgrenade.svg'
			}
		},

		grenades() {
			const grenades = {
				flashbang: 0,
				hegrenade: 0,
				molotov: 0,
				smokegrenade: 0,
				decoy: 0,
				total: 0,
			}

			for (const player of this.team.players) {
				for (const grenade of player.grenades) {
					const name = this.getGrenadeName(grenade)

					grenades[name]++
					grenades.total++
				}
			}

			return grenades
		},
	},

	methods: {
		getGrenadeName(grenade) {
			switch (grenade.name) {
				case 'weapon_decoy': return 'decoy'
				case 'weapon_flashbang': return 'flashbang'
				case 'weapon_hegrenade': return 'hegrenade'
				case 'weapon_smokegrenade': return 'smokegrenade'

				case 'weapon_incgrenade':
				case 'weapon_molotov':
					return 'molotov'
			}
		},
	},
}
