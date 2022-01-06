<template>
	<div :class="[`match-point --${direction}`, { '--active': freezetime && matchPoint }]">
		<div class="diagonal-wrapper --outer">
			<div :class="`diagonal --${direction}`"></div>
		</div>

		<div :class="`inner --${direction}`">
			{{ matchPointText || '&nbsp;' }}
		</div>

		<div :class="`diagonal-wrapper --inner --${direction}`">
			<div :class="`diagonal --${direction}`"></div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	props: [
		'direction',
		'side',
	],

	computed: {
		...mapGetters([
			'map',
			'timers',
			'series',
		]),

		matchPoint() {
			return this.map[`team_${this.side}`].score === this.roundsForMatchPoint
		},

		matchPointText() {
			if (this.series.length < 2 || this.series.length % 2 === 0) return 'Match Point'

			const matchWinsRequiredToWinSeries = Math.ceil(this.series.length / 2)

			switch (this.direction) {
				case 'left':
					return this.series.reduce((wins, match) => wins + (match.scoreLeft > match.scoreRight), 0) + 1 >= matchWinsRequiredToWinSeries ? 'Series Point' : 'Match Point'

				case 'right':
					return this.series.reduce((wins, match) => wins + (match.scoreLeft < match.scoreRight), 0) + 1 >= matchWinsRequiredToWinSeries ? 'Series Point' : 'Match Point'
			}
		},

		half() {
			if (this.map.round < 15) return 1
			if (this.map.round < 30) return 2

			return 2 + Math.ceil((this.map.round - 29) / 3)
		},

		roundsForMatchPoint() {
			return (this.half < 3)
				? 15
				: Math.floor((this.half - (this.half % 2 === 0 ? 1 : 0)) / 2) * 3 + 15
		},

		freezetime() {
			return ['paused', 'timeout_ct', 'timeout_t', 'freezetime'].includes(this.timers.phase)
		},
	},
}
</script>
