<template>
	<div class="tactical-timeout-wrapper">
		<div :class="[`tactical-timeout --${direction}`, { '--active': active }]">
			<div class="diagonal-wrapper --outer">
				<div :class="`diagonal --${direction}`"></div>
			</div>

			<div :class="`inner --${direction} --${side}`">
				<div class="heading">
					Tactical Timeout
				</div>

				<div class="remaining">
					{{ team.timeouts_remaining }} / 4 remaining
				</div>

				<div :class="`progress-bar-wrapper --${direction}`">
					<div :class="`progress-bar --${direction}`">
						<div
							:class="[`fill --${direction} --${side}`]"
							:style="{ transform: `scaleX(${remainingTime})` }"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	props: [
		'direction',
		'side',
		'team',
	],

	data() {
		return {
			remainingTime: 1,
		}
	},

	computed: {
		...mapGetters([
			'timers',
		]),

		active() {
			return this.timers.phase === 'timeout_' + this.side
		},
	},

	watch: {
		timers(now) {
			if (! ['freezetime', 'live'].includes(now.phase)) this.remainingTime = now.phase_ends_in / 30
		},

		active(now, previously) {
			if (now) this.remainingTime = 1
			else setTimeout(() => this.remainingTime = 1, 350)
		},
	},
}
</script>
