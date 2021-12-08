<template>
	<div v-if="applicable && map" class="container" :style="{ width }">
		<PreMatchIntro v-if="prePostMatchAnimationsEnabled" :directionalSides="directionalSides" />

		<Minimap :directionalSides="observerSlotSortingEnabled ? directionalSides : null" />
		<TopBar :directionalSides="directionalSides" />
		<PlayersAlive :directionalSides="directionalSides" />
		<Series :directionalSides="directionalSides" />

		<RoundWinner />

		<FocusedPlayer :adr="adr" />
		<Sidebars :adr="adr" :directionalSides="directionalSides" />
	</div>

	<div v-else-if="applicable" class="container" :style="{ width }">
		<div class="corner --top --left"></div>
		<div class="corner --top --right"></div>
		<div class="corner --bottom --left"></div>
		<div class="corner --bottom --right"></div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import FocusedPlayer from './FocusedPlayer'
import Minimap from './Minimap'
import PlayersAlive from './PlayersAlive'
import PreMatchIntro from './Animations/PreMatchIntro'
import RoundGraph from './RoundGraph'
import RoundWinner from './RoundWinner'
import Series from './Series'
import Sidebars from './Sidebars'
import Timeout from './Timeout'
import TopBar from './TopBar'

export default {
	components: {
		FocusedPlayer,
		Minimap,
		PlayersAlive,
		PreMatchIntro,
		RoundGraph,
		RoundWinner,
		Series,
		Sidebars,
		Timeout,
		TopBar,
	},

	data() {
		return {
			adr: {},
			damageAtBeginningOfRound: {},
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
			const currentRound = this.map.team_ct.score + this.map.team_t.score + Number(this.round && this.round.phase === 'over')

			for (const player in this.roundDamage) {
				let damage = 0
				let rounds = 0

				for (const round in this.roundDamage[player]) {
					if (rounds >= currentRound) break

					rounds++
					damage += this.roundDamage[player][round]
				}

				this.adr[player] = damage / (rounds || 1)
			}
		},
	},

	computed: {
		...mapGetters([
			'allplayers',
			'cleardata',
			'impulse',
			'map',
			'observerSlotSortingEnabled',
			'prePostMatchAnimationsEnabled',
			'primaryTeam',
			'round',
			'timers',
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
			if (! this.round) return

			if (this.round.phase === 'freezetime') {
				for (const id in allplayers) {
					this.damageAtBeginningOfRound[id] = allplayers[id].state.round_totaldmg
				}

				return
			}

			const round = (this.round.phase === 'over')
				? this.map.round - 1
				: this.map.round

			for (const id in allplayers) {
				if (! this.roundDamage.hasOwnProperty(id)) this.roundDamage[id] = {}

				if (! this.roundDamage[id].hasOwnProperty(round)) this.roundDamage[id][round] = 0

				const roundDamage = allplayers[id].state.round_totaldmg - this.damageAtBeginningOfRound[id]

				if (this.roundDamage[id][round] < roundDamage) this.roundDamage[id][round] = roundDamage
			}
		},

		cleardata() {
			this.adr = {}
			this.roundDamage = {}
		},

		round(round, previous) {
			if (! round || ! previous || round.phase === previous.phase) return

			this.calculateAdr()
		},

		timers(timers, previous) {
			// try and recalculate ADR in a couple more edge cases
			if (
				timers
				&& previous
				&& timers.phase === previous.phase
				&& Number(timers.phase_ends_in) > Number(previous.phase_ends_in)
			) {
				this.calculateAdr()
			}
		},

		impulse(impulse) {
			switch (impulse) {
				case 'recalculateAdr': return this.calculateAdr()
			}
		},
	},
}
</script>
