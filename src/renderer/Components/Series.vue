<template>
	<div
		v-if="series.length > 0"
		:class="['series', { '--active': map.phase === 'intermission' || ['paused', 'timeout_ct', 'timeout_t', 'freezetime'].includes(timers.phase) }]"
	>
		<div class="headings">
			<div class="picked">Picked</div>
			<div class="winner">Winner</div>
			<div class="score">Score</div>
		</div>

		<div class="matches">
			<div v-for="match in series" :class="`match --${match.map}`">
				<div class="wrapper">
					<div class="map">{{ match.map }}</div>

					<div class="picked" v-if="match.picked">
						<img :src="`https://flagcdn.com/h60/${teams[match.picked].flag}.png`">
					</div>

					<div v-if="match.currentlyPlaying" class="currently-playing">
						<span>Currently Playing</span>
					</div>

					<template v-else>
						<div class="winner">
							<img v-if="match.scoreLeft > match.scoreRight" :src="`https://flagcdn.com/h60/${teams[0].flag}.png`">
							<img v-else-if="match.scoreRight > match.scoreLeft" :src="`https://flagcdn.com/h60/${teams[1].flag}.png`">
						</div>

						<div class="score" v-if="match.scoreLeft || match.scoreRight">
							{{ match.scoreLeft }} : {{ match.scoreRight }}
						</div>
					</template>
				</div>
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

	computed: {
		...mapGetters([
			'map',
			'series',
			'timers',
		]),

		teams() {
			return [
				this.map[`team_${this.directionalSides[0]}`],
				this.map[`team_${this.directionalSides[1]}`],
			]
		},
	},
}
</script>
