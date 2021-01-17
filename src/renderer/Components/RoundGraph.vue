<template>
	<div :class="['round-graph', { '--active': active }]">
		<div class="match-point-wrapper">
			<div v-if="matchpoint.left" :class="`match-point --left --${directionalSides[0]}`">
				{{ matchPointText.left }}
			</div>

			<div v-if="matchpoint.right" :class="`match-point --right --${directionalSides[1]}`">
				{{ matchPointText.right }}
			</div>
		</div>

		<div class="heading">
			<template v-if="half === 1">1st Half</template>
			<template v-else-if="half === 2">2nd Half</template>
			<template v-else>
				OT {{ Math.ceil((half - 2) / 2) }}
				<template v-if="half % 2">1st Half</template>
				<template v-else>2nd Half</template>
			</template>
		</div>

		<div :class="['rounds', { '--ot': half >= 3 }]">
			<div v-for="round in rounds" :class="`round --${round.side}`">
				<div class="number">{{ round.number }}</div>
				<div :class="`colored-bar --${round.side}`" />

				<div v-if="round.image" :class="`image --${round.side}`" v-html="image(require(`../../img/${round.image}.svg`))" />
				<div v-else class="image" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	props: [
		'directionalSides',
	],

	methods: {
		image(str) {
			return decodeURIComponent(str.replace(/^data:image\/svg\+xml,/, ''))
		},
	},

	computed: {
		...mapGetters([
			'map',
			'timers',
			'series',
		]),

		matchpoint() {
			const matchPointRounds = (this.half < 3)
				? 15
				: Math.floor((this.half - (this.half % 2 === 0 ? 1 : 0)) / 2) * 3 + 15

			return {
				left: this.map[`team_${this.directionalSides[0]}`].score === matchPointRounds,
				right: this.map[`team_${this.directionalSides[1]}`].score === matchPointRounds,
			}
		},

		half() {
			if (this.map.round < 15) return 1
			if (this.map.round < 30) return 2

			return 2 + Math.ceil((this.map.round - 29) / 3)
		},

		firstRound() {
			if (this.half === 1) return 1
			if (this.half === 2) return 16

			return 31 + (Math.ceil((this.half - 2) / 2) - 1) * 6
		},

		roundCount() {
			return (this.half <= 2) ? 15 : 6
		},

		rounds() {
			const rounds = []

			const firstRoundInternal = (this.half === 2) ? 16 : 1

			for (let i = 0; i < this.roundCount; i++) {
				const number = firstRoundInternal + i
				const win = this.map.round_wins ? (this.map.round_wins[number] || '') : ''
				const side = win.startsWith('ct_') ? 'ct' : (win.startsWith('t_') ? 't' : null)

				let image = win.split('_')[2]
				image = (image === 'defuse')
					? 'weapons/defuser'
					: (image === 'time' ? 'timer' : image)

				rounds.push({
					image, side,

					number: this.firstRound + i,
					borderRight: i > 30 && (i - 30) % 3 === 0,
				})
			}

			return rounds
		},

		active() {
			return ['paused', 'timeout_ct', 'timeout_t', 'freezetime'].includes(this.timers.phase)
		},

		matchPointText() {
			if (this.series.length < 2 || this.series.length % 2 === 0) return { left: 'Match Point', right: 'Match Point' }

			const matchWinsRequiredToWinSeries = Math.ceil(this.series.length / 2)

			return {
				left: this.series.reduce((wins, match) => wins + (match.scoreLeft > match.scoreRight), 0) + 1 >= matchWinsRequiredToWinSeries ? 'Series Point' : 'Match Point',
				right: this.series.reduce((wins, match) => wins + (match.scoreLeft < match.scoreRight), 0) + 1 >= matchWinsRequiredToWinSeries ? 'Series Point' : 'Match Point',
			}
		},
	},
}
</script>
