<template>
	<div v-if="applicable && map" class="container" :style="{ width }">
		<TopBar :directionalSides="directionalSides" />
		<RoundWinner />
		<Timeout />
		<PlayersAlive :directionalSides="directionalSides" />
		<Series :directionalSides="directionalSides" />

		<FocusedPlayer :adr="adr" />
		<Sidebars :adr="adr" :directionalSides="directionalSides" />
	</div>
</template>

<script>
import FocusedPlayer from './FocusedPlayer'
import PlayersAlive from './PlayersAlive'
import RoundWinner from './RoundWinner'
import Series from './Series'
import Sidebars from './Sidebars'
import Timeout from './Timeout'
import TopBar from './TopBar'
import { mapGetters } from 'vuex'

export default {
	components: {
		FocusedPlayer,
		PlayersAlive,
		RoundWinner,
		Series,
		Sidebars,
		Timeout,
		TopBar,
	},

	data() {
		return {
			adr: {},
			roundDamage: {},
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

		calculateAdr() {
			for (const player in this.roundDamage) {
				let damage = 0
				let rounds = 0

				for (const round in this.roundDamage[player]) {
					rounds++
					damage += this.roundDamage[player][round]
				}

				this.adr[player] = damage / rounds
			}
		},
	},

	computed: {
		...mapGetters([
			'allplayers',
			'map',
			'primaryTeam',
			'round',
		]),

		applicable() {
			return window.location.hash === '#hud'
		},

		directionalSides() {
			if (! this.map) return ['ct', 't']

			if (this.map.team_ct.name === this.primaryTeam) return ['ct', 't']
			if (this.map.team_t.name === this.primaryTeam) return ['t', 'ct']
			if (this.map.team_ct.flag === 'de') return ['ct', 't']
			if (this.map.team_t.flag === 'de') return ['t', 'ct']

			return ['ct', 't']
		},
	},

	watch: {
		allplayers(allplayers) {
			if (! this.round || this.round.phase === 'freezetime') return

			const round = (this.round.phase === 'over')
				? this.map.round - 1
				: this.map.round

			for (const id in allplayers) {
				if (! this.roundDamage.hasOwnProperty(id)) this.roundDamage[id] = {}
				this.roundDamage[id][round] = allplayers[id].state.round_totaldmg
			}
		},

		round(round, previous) {
			if (! round || ! previous || round.phase === previous.phase) return

			if (['over', 'freezetime'].includes(round.phase)) this.calculateAdr()
		},
	},
}
</script>
