import Digits from '/hud/digits/digits.vue'
import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	components: {
		Digits,
	},

	computed: {
		clockMinutes() {
			return Math.floor(this.$round.phaseEndsInSec / 60)
		},

		clockSeconds() {
			return Math.ceil(this.$round.phaseEndsInSec % 60)
		},

		isMatchPointRoundsActive() {
			// TODO configurable: only show in freezetime
			return this.$round.isFreezetime && this.$round.isOvertime
		},

		leftTeamColorClass() {
			return this.teamColorClass(this.$teams[0])
		},

		rightTeamColorClass() {
			return this.teamColorClass(this.$teams[1])
		},
	},

	methods: {
		teamColorClass,
	},
}
