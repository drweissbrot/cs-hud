<template>
	<div :class="['round-winner', { '--active': active }]">
		<div v-if="win_team" :class="`icon --${win_team}`">
			<img class="flag" :src="`https://flagcdn.com/h60/${team.flag}.png`">
		</div>

		<div v-if="win_team" class="text">
			<div :class="`label --${win_team}`">
				{{ team.name }}
			</div>

			<div class="info">
				wins the Round<br>
				{{ reason }}
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	data() {
		return {
			win_team: false,
		}
	},

	methods: {
		sync() {
			this.win_team = this.round.win_team ? this.round.win_team.toLowerCase() : this.round.win_team
		},
	},

	computed: {
		...mapGetters([
			'map',
			'round',
		]),

		active() {
			return this.round && this.round.phase === 'over'
		},

		team() {
			return this.map[`team_${this.win_team}`]
		},

		reason() {
			let latestRound = -1

			for (const round in this.map.round_wins) {
				const roundNum = Number(round)
				if (roundNum > latestRound) latestRound = roundNum
			}

			if (latestRound === -1) return
			if (this.map.round_wins[latestRound].endsWith('_elimination')) return 'by Eliminating the Enemy Team'
			if (this.map.round_wins[latestRound].endsWith('_bomb')) return 'by Detonating the Bomb'
			if (this.map.round_wins[latestRound].endsWith('_defuse')) return 'by Defusing the Bomb'
			if (this.map.round_wins[latestRound].endsWith('_time')) return 'by Running down the Clock'
		},
	},

	watch: {
		round(now) {
			if (now.phase === 'over') this.sync()
		},

		active(now, previously) {
			if (now) this.sync()
			else setTimeout(this.sync, 1000)
		},
	},
}
</script>
