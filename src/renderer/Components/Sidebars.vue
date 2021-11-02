<template>
	<div class="sidebars">
		<Sidebar
			v-for="(players, direction) in { left, right }"
			:adr="adr"
			:class="{ '--series-active': seriesActive }"
			:direction="direction"
			:freezetime="freezetime"
			:key="direction"
			:players="players"
			:side="directionalSides[Number(direction === 'right')]"
		/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from './Sidebar'

export default {
	components: {
		Sidebar,
	},

	props: [
		'adr',
		'directionalSides',
	],

	computed: {
		...mapGetters([
			'allplayers',
			'map',
			'series',
			'timers',
		]),

		players() {
			const players = []

			for (const id in this.allplayers) {
				this.allplayers[id].steamid = id
				players.push(this.allplayers[id])
			}

			return players.sort(({ name: a }, { name: b }) => {
				a = a.toLowerCase()
				b = b.toLowerCase()

				if (a === b) return 0
				return (a > b) ? 1 : -1
			})
		},

		left() {
			const team = this.directionalSides[0].toUpperCase()
			return this.players.filter((player) => player.team === team)
		},

		right() {
			const team = this.directionalSides[1].toUpperCase()
			return this.players.filter((player) => player.team === team)
		},

		freezetime() {
			return this.map.phase === 'intermission'
				|| ['paused', 'timeout_ct', 'timeout_t', 'freezetime'].includes(this.timers.phase)
		},

		seriesActive() {
			return this.series.length > 1 && this.freezetime
		},
	},

	watch: {
		timers(timers, previously) {
			if (timers.phase === previously.phase || previously.phase === 'defuse') return

			if (timers.phase === 'live') {
				this.timeout = setTimeout(() => {
					this.statsActive = false

					this.timeout = setTimeout(() => this.utilityActive = false, 2500)
				}, 3500)
			} else if (timers.phase === 'bomb') {
				clearTimeout(this.timeout)
				this.statsActive = false
				this.utilityActive = true

				this.timeout = setTimeout(() => this.utilityActive = false, 7500)
			} else if (['freezetime', 'paused', 'timeout_ct', 'timeout_t'].includes(timers.phase)) {
				clearTimeout(this.timeout)
				this.statsActive = this.utilityActive = true
			} else if (timers.phase === 'warmup') {
				clearTimeout(this.timeout)
				this.statsActive = true
				this.utilityActive = false
			}
		},
	},
}
</script>
