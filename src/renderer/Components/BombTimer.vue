<template>
	<div v-if="bomb" :class="[`bomb-timer --${direction}`, { '--active': active }]">
		<div class="diagonal-wrapper --outer">
			<div :class="`diagonal --${direction}`"></div>
		</div>

		<div :class="`progress-bar-wrapper --${direction}`">
			<div :class="`progress-bar --${direction}`">
				<div
					:class="[`fill --${direction} --${side}`, { '--planting': bomb.state === 'planting' }]"
					:style="{ transform: `scaleX(${bombTimerScale})` }"
				/>
			</div>
		</div>

		<div :class="`diagonal-wrapper --inner --${direction}`">
			<div :class="`diagonal --${direction}`"></div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	props: [
		'direction',
		'side',
	],

	data() {
		return {
			defuseDuration: 10,
			bombTimerScale: 1,
			bombTimerScaleInterval: null,
		}
	},

	methods: {
		clearBombTimerScaleInterval() {
			clearInterval(this.bombTimerScaleInterval)
			this.bombTimerScaleInterval = null
		},
	},

	computed: {
		...mapGetters([
			'allplayers',
			'bomb',
		]),

		active() {
			if (this.side === 't') return ['planting', 'planted', 'defusing'].includes(this.bomb.state)
			if (this.side === 'ct') return this.bomb.state === 'defusing'
		},
	},

	watch: {
		bomb(now, previous) {
			if (this.bomb.state === 'defused') return this.clearBombTimerScaleInterval()

			if (this.side === 't') {
				if (this.bomb.state === 'planting') {
					this.bombTimerScale = this.bomb.countdown / 3
				} else if (this.bomb.state === 'planted') {
					this.bombTimerScale = this.bomb.countdown / 40

					if (! this.bombTimerScaleInterval) {
						this.bombTimerScale = 1

						this.bombTimerScaleInterval = setInterval(() => {
							this.bombTimerScale -= .0025 // 1/400, as this interval should trigger 400 times during the 40 second c4timer

							if (this.bombTimerScale < 0) this.clearBombTimerScaleInterval()
						}, 100)
					}
				}
			}

			if (this.side === 'ct') {
				if (now.state === 'defusing' && previous.state !== 'defusing') {
					this.defuseDuration = (
						this.allplayers[now.player].state
						&& this.allplayers[now.player].state.defusekit || false
					) ? 5 : 10

					if (! this.bombTimerScaleInterval) {
						this.bombTimerScale = 1

						this.bombTimerScaleInterval = setInterval(() => {
							this.bombTimerScale -= .1 / this.defuseDuration

							if (this.bombTimerScale < 0) this.clearBombTimerScaleInterval()
						}, 100)
					}
				} else if (now.state !== 'defusing' && (! previous || previous.state === 'defusing')) {
					this.clearBombTimerScaleInterval()
				}
			}
		},

		timers(now) {
			if (this.bombTimerScaleInterval && ['paused', 'timeout_ct', 'timeout_t', 'freezetime'].includes(now.phase)) {
				this.clearBombTimerScaleInterval()
				this.bombTimerScale = 1
			}
		},
	},
}
</script>
