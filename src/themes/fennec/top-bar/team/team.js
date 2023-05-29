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
		colorClass() {
			return this.teamColorClass(this.team)
		},

		positionClass() {
			return `--${this.position}`
		},

		isBombTimerPanelActive() {
			switch (this.team.side) {
				case 2: return ['defusing', 'planted', 'planting'].includes(this.$bomb.state)
				case 3: return this.$bomb.state === 'defusing'
			}
		},

		isRoundWinnerPanelActive() {
			return (this.$round.phase === 'over' && this.$round.winningSide === this.team.side)
			// TODO configurable
			// || (this.$round.isFreezetime && this.$rounds[this.$rounds.length - 1].winningSide === this.team.side)
		},

		isMatchPointPanelActive() {
			return this.$round.isFreezetime && this.team.score === this.$round.matchPointAtScore
		},

		isTimeoutPanelActive() {
			switch (this.team.side) {
				case 2: return this.$round.phase === 'timeout_t'
				case 3: return this.$round.phase === 'timeout_ct'
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
					// TODO override this after the bomb has been planted
					return this.$opts['cvars.mp_c4timer']
				}

				case 3: {
					if (this.$bomb?.player?.hasDefuser) return 5
					return 10
				}
			}
		},

		matchPointPanelText() {
			// TODO "series point" when match win would also win series
			// TODO config option to have this say "map point" instead
			return 'Match Point'
		},
	},

	methods: {
		teamColorClass,
	},
}
