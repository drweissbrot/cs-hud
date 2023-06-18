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
			return teamColorClass(this.team)
		},

		positionClass() {
			return `--${this.position}`
		},

		isTimeoutPanelActive() {
			switch (this.team.side) {
				case 2: return this.$round.phase === 'timeout_t'
				case 3: return this.$round.phase === 'timeout_ct'
			}
		},
	},
}
