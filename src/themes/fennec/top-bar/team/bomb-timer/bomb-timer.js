import { positionClass } from '/hud/helpers/position-class.js'
import { teamColorClass } from '/hud/helpers/team-color-class.js'
import ProgressBar from '/hud/progress-bar/progress-bar.vue'

export default {
	props: [
		'position',
		'team',
	],

	components: {
		ProgressBar,
	},

	computed: {
		positionClass,

		colorClass() {
			return teamColorClass(this.team)
		},

		isBombTimerPanelActive() {
			switch (this.team.side) {
				case 2: return ['defusing', 'planted', 'planting'].includes(this.$bomb.state)
				case 3: return this.$bomb.state === 'defusing'
			}
		},

		bombTimerValue() {
			if (this.team.side === 2 && this.$bomb.state === 'defusing') return this.$bomb.plantedCountdownSec
			return this.$bomb.countdownSec
		},

		bombTimerColorClass() {
			if (this.team.side === 3) return '--ct'

			if (this.$bomb.state === 'planting') return '--bomb'
			return '--t'
		},

		bombTimerMaxValue() {
			switch (this.team.side) {
				case 2: {
					if (this.$bomb.state === 'planting') return 3.2
					return this.$opts['cvars.mp_c4timer']
				}

				case 3: {
					if (this.$bomb?.player?.hasDefuser) return 5
					return 10
				}
			}
		},
	},
}
