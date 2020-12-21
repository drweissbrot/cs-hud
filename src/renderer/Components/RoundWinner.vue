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
				wins the Round

				<template v-if="bomb === 'defused'">
					by Defusing the Bomb
				</template>

				<template v-else-if="bomb === 'exploded'">
					by Detonating the Bomb
				</template>
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
			bomb: null,
		}
	},

	methods: {
		sync() {
			this.win_team = this.round.win_team ? this.round.win_team.toLowerCase() : this.round.win_team
			this.bomb = this.round.bomb
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
	},

	watch: {
		round(now) {
			if (now.phase === 'over') {
				this.sync()
			}
		},

		active(now, previously) {
			if (now) this.sync()
			else setTimeout(this.sync, 1000)
		},
	},
}
</script>
