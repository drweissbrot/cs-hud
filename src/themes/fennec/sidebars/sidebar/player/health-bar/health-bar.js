import { positionClass } from '/hud/helpers/position-class.js'
import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	props: [
		'position',
		'player',
	],

	data() {
		return {
			damageTakenTimeout: null,
			healthBeforeDamageTaken: this.player.health,
		}
	},

	beforeUnmount() {
		this.clearDamageTakenTimeout()
	},

	computed: {
		positionClass,

		colorClass() {
			return teamColorClass(this.player.team)
		},
	},

	methods: {
		clearDamageTakenTimeout() {
			if (this.damageTakenTimeout) clearTimeout(this.damageTakenTimeout)
		},
	},

	watch: {
		player(now, previously) {
			if (now.health === previously.health) return

			this.clearDamageTakenTimeout()

			this.damageTakenTimeout = setTimeout(() => {
				this.healthBeforeDamageTaken = this.player.health
			}, 2500)
		},
	},
}
