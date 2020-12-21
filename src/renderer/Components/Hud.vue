<template>
	<div v-if="map" class="container" :style="{ width }">
		<TopBar :directionalSides="directionalSides" />
		<RoundWinner />
		<Timeout />
		<PlayersAlive :directionalSides="directionalSides" />
		<!-- TODO <Series /> -->

		<FocusedPlayer />
	</div>
</template>

<script>
import FocusedPlayer from './FocusedPlayer'
import PlayersAlive from './PlayersAlive'
import RoundWinner from './RoundWinner'
import Series from './Series'
import Timeout from './Timeout'
import TopBar from './TopBar'
import { mapGetters } from 'vuex'

export default {
	components: {
		FocusedPlayer,
		PlayersAlive,
		RoundWinner,
		Series,
		Timeout,
		TopBar,
	},

	data() {
		return {
			width: null,
		}
	},

	mounted() {
		window.addEventListener('resize', this.onResize)
		this.onResize()
	},

	beforeDestroy() {
		window.removeEventListener('resize', this.onResize)
	},

	methods: {
		onResize(e) {
			this.width = (window.innerWidth / window.innerHeight > 16 / 9)
				? `${16 / 9 * window.innerHeight}px`
				: null
		},
	},

	computed: {
		...mapGetters([
			'map',
		]),

		directionalSides() {
			if (! this.map) return ['ct', 't']

			if (this.map.team_ct.name === 'Das Deutsche Volk') return ['ct', 't']
			if (this.map.team_t.name === 'Das Deutsche Volk') return ['t', 'ct']
			if (this.map.team_ct.flag === 'de') return ['ct', 't']
			if (this.map.team_t.flag === 'de') return ['t', 'ct']

			return ['ct', 't']
		},
	},
}
</script>
