<template>
	<div :class="['players-alive', { '--active': active }]">
		<div class="label">
			Players Alive
		</div>

		<div :class="`count --${directionalSides[0]}`">
			<div class="digit">{{ counts[0] }}</div>
		</div>

		<div class="vs">
			vs
		</div>

		<div :class="`count --${directionalSides[1]}`">
			<div class="digit">{{ counts[1] }}</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	props: [
		'directionalSides',
	],

	computed: {
		...mapGetters([
			'allplayers',
			'map',
			'series',
			'timers',
		]),

		counts() {
			let ct = 0
			let t = 0

			for (const id in this.allplayers) {
				const player = this.allplayers[id]
				if (player.state.health < 1) continue

				if (player.team === 'T') t++
				else if (player.team === 'CT') ct++
			}

			return (this.directionalSides[0] === 'ct')
				? [ct, t]
				: [t, ct]
		},

		active() {
			return this.map.phase !== 'intermission'
				&& ! ['paused', 'timeout_ct', 'timeout_t', 'freezetime'].includes(this.timers.phase)
		},
	},
}
</script>
