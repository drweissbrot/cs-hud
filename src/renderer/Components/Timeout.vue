<template>
	<div :class="['timeout', { '--active': active }]">
		<div v-if="tactical" :class="`icon --${tactical}`">
			<img src="../../img/timer.svg">
		</div>

		<div v-else class="icon">
			<img src="../../img/pause.svg">
		</div>

		<div class="text">
			<template v-if="tactical">
				<div class="label">
					Tactical Timeout
				</div>

				<div class="info">
					{{ tacticalTeam.name }} called a Timeout<br>
					{{ tacticalTeam.timeouts_remaining }} / 4 remaining
				</div>

				<div class="progress-bar">
					<div :class="`fill --${tactical}`" :style="{ transform: `scaleX(${remainingTime})` }" />
				</div>
			</template>

			<div v-else class="label">
				Technical Pause
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	data() {
		return {
			tactical: false,
			tacticalTeam: null,
			remainingTime: 1,
		}
	},

	methods: {
		syncTactical() {
			if (this.timers.phase === 'timeout_ct') this.tactical = 'ct'
			else if (this.timers.phase === 'timeout_t') this.tactical = 't'
			else this.tactical = false

			this.tacticalTeam = (this.tactical)
				? this.map[`team_${this.tactical}`]
				: null
		},
	},

	computed: {
		...mapGetters([
			'map',
			'timers',
		]),

		active() {
			return ['paused', 'timeout_ct', 'timeout_t'].includes(this.timers.phase)
		},
	},

	watch: {
		timers(now) {
			if (! ['freezetime', 'live'].includes(now.phase)) {
				this.syncTactical()
				this.remainingTime = now.phase_ends_in / 30
			}
		},

		active(now, previously) {
			if (now) {
				this.syncTactical()
				this.remainingTime = 1
			} else {
				setTimeout(() => {
					this.syncTactical()
					this.remainingTime = 1
				}, 1000)
			}
		},
	},
}
</script>
