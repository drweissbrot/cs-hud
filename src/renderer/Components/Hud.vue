<template>
	<div v-if="map" class="container">
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

	computed: {
		...mapGetters([
			'gameState',
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
