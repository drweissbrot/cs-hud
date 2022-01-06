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
import * as fs from 'fs'
import { mapGetters } from 'vuex'

export default {
	props: [
		'direction',
		'side',
		'team',
	],

	data() {
		return {
			audio: null,
			cancelAudioTimeout: null,
			musicBlobUrls: [],
			remainingTime: 1,
		}
	},

	mounted() {
		this.updateMusicBlobUrls()
	},

	beforeDestroy() {
		for (const url of this.musicBlobUrls) URL.revokeObjectURL(url)
	},

	computed: {
		...mapGetters([
			'impulse',
			'tacticalTimeoutMusicPaths',
			'timers',
		]),

		active() {
			return this.timers.phase === 'timeout_' + this.side
		},
	},

	methods: {
		updateMusicBlobUrls() {
			for (const url of this.musicBlobUrls) URL.revokeObjectURL(url)

			const urls = []

			for (const path of this.tacticalTimeoutMusicPaths) {
				urls.push(URL.createObjectURL(new Blob([fs.readFileSync(path)])))
			}

			this.musicBlobUrls = urls
		},

		playAudio() {
			if (this.audio) return

			this.audio = true // try to prevent some edge cases where the music starts playing twice
			this.audio = new Audio(this.musicBlobUrls[Math.floor(Math.random() * this.musicBlobUrls.length)])
			this.audio.play()

			this.audio.addEventListener('durationchange', () => {
				if (this.cancelAudioTimeout) return

				this.cancelAudioTimeout = setTimeout(() => this.cancelAudio(), (this.audio.duration - this.audio.currentTime) * 1000)
			})
		},

		cancelAudio() {
			clearTimeout(this.cancelAudioTimeout)
			this.cancelAudioTimeout = null

			if (! this.audio) return

			this.audio.pause()
			this.audio = null
		},
	},

	watch: {
		timers(now) {
			if (! ['freezetime', 'live'].includes(now.phase)) {
				this.remainingTime = Math.max(0, Math.min(1, now.phase_ends_in / 30))
			}
		},

		active(now, previously) {
			if (! now) {
				return setTimeout(() => this.remainingTime = 1, 350)
			}

			this.remainingTime = 1
			if (! previously) this.playAudio()
		},

		tacticalTimeoutMusicPaths(now, previously) {
			this.updateMusicBlobUrls()
		},

		impulse(impulse) {
			switch (impulse) {
				// only play music on command for one of the two instances of this component
				case 'playTacticalTimeoutMusic': return this.direction === 'left' && this.playAudio()
				case 'cancelTacticalTimeoutMusic': return this.cancelAudio()
			}
		},
	},
}
</script>
