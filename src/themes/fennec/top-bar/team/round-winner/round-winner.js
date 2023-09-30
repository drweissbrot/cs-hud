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

		isRoundWinnerPanelActive() {
			if (this.$round.phase === 'over') {
				return this.$round.winningSide === this.team.side
			}

			if (
				this.$round.isFreezetime
				&& this.$opts['preferences.topBar.team.roundWinnerPanel.showIntoFreezetimeSec']
				&& this.$rounds[this.$rounds.length - 1].winningSide === this.team.side
			) {
				this.$opts['cvars.mp_freezetime'] // 20
				this.$opts['preferences.topBar.team.roundWinnerPanel.showIntoFreezetimeSec'] // 3
				this.$round.phaseEndsInSec // 15

				return this.$opts['cvars.mp_freezetime'] - this.$round.phaseEndsInSec < this.$opts['preferences.topBar.team.roundWinnerPanel.showIntoFreezetimeSec']
			}

			return false
		},
	},
}
