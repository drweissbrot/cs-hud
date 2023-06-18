import Round from '/hud/series-graph/match/round-graph/round/round.vue'

export default {
	components: {
		Round,
	},

	computed: {
		isSecondHalf() {
			if (this.$round.isOvertime) return
			return this.$round.roundNumber > (this.$opts['cvars.mp_maxrounds'] / 2)
		},

		firstRoundNumber() {
			if (this.$round.isOvertime) {
				return this.$opts['cvars.mp_maxrounds'] + (this.$round.overtimeNumber - 1) * this.$opts['cvars.mp_overtime_maxrounds'] + 1
			}

			return this.isSecondHalf
				? (this.$opts['cvars.mp_maxrounds'] / 2) + 1
				: 1
		},

		lastRoundNumber() {
			if (this.$round.isOvertime) {
				return this.firstRoundNumber + this.$opts['cvars.mp_overtime_maxrounds'] - 1
			}

			return this.firstRoundNumber + (this.$opts['cvars.mp_maxrounds'] / 2) - 1
		},

		currentOvertimeLastRoundNumberOfFirstHalf() {
			if (! this.$round.isOvertime) return
			return this.firstRoundNumber + this.$opts['cvars.mp_overtime_maxrounds'] / 2 - 1
		},

		rounds() {
			const rounds = []

			for (let i = this.firstRoundNumber; i <= this.lastRoundNumber; i++) {
				const round = this.$rounds.find((round) => round.roundNumber === i) || { roundNumber: i }

				rounds.push({
					...round,
					isLastRoundOfHalf: round.roundNumber === this.currentOvertimeLastRoundNumberOfFirstHalf,
				})
			}

			return rounds
		},
	},
}
