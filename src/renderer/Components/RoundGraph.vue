<template>
	<div :class="['round-graph', { '--active': active }]">
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
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	methods: {
		image(str) {
			return decodeURIComponent(str.replace(/^data:image\/svg\+xml,/, ''))
		},
	},

	computed: {
		...mapGetters([
			'map',
			'timers',
		]),

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

			for (let i = this.firstRound; i < this.firstRound + this.roundCount; i++) {
				const number = (i > 30) ? i - 30 : i
				const win = this.map.round_wins ? (this.map.round_wins[number] || '') : ''
				const image = win.split('_')[2]

				rounds.push({
					number: i,
					side: win.startsWith('ct_') ? 'ct' : (win.startsWith('t_') ? 't' : null),
					image: (image === 'defuse')
						? 'weapons/defuser'
						: (image === 'time' ? 'timer' : image),
					borderRight: i > 30 && (i - 30) % 3 === 0,
				})
			}

			return rounds
		},

		active() {
			return ['paused', 'timeout_ct', 'timeout_t', 'freezetime'].includes(this.timers.phase)
		},
	},
}
</script>
