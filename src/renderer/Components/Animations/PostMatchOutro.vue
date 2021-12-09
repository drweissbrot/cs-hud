<template>
	<div v-if="active && series && series.length" class="post-match-outro">
		<Marquees />
		<GenericBackground />

		<div class="series --active">
			<PostMatchOutroSeriesMatch
				v-for="(match, index) in series"
				:isComingUpNext="series[index - 1] && series[index - 1].currentlyPlaying"
				:key="index"
				:match="match"
				:seriesLength="series.length"
				:teams="teams"
			/>
		</div>

		<Skillgroups />
		<Logo />
	</div>
</template>

<script>
import * as fs from 'fs'
import { mapGetters } from 'vuex'
import GenericBackground from './GenericBackground'
import Logo from './Logo'
import Marquees from './Marquees'
import PostMatchOutroSeriesMatch from './PostMatchOutroSeriesMatch'
import Skillgroups from './Skillgroups'

export default {
	components: {
		GenericBackground,
		Logo,
		Marquees,
		PostMatchOutroSeriesMatch,
		Skillgroups,
	},

	props: [
		'directionalSides',
	],

	data() {
		return {
			active: false,
			audio: null,
			musicBlobUrl: null,
			postMatchOutroAlreadyPlayed: false,
			unsetActiveTimeout: null,
		}
	},

	mounted() {
		this.updateMusicBlobUrl()
	},

	beforeDestroy() {
		URL.removeObjectURL(this.musicBlobUrl)
	},

	computed: {
		...mapGetters([
			'autoplayPostMatchAnimations',
			'impulse',
			'map',
			'postMatchOutroMusicPath',
			'series',
			'timers',
		]),

		teams() {
			return [
				this.map[`team_${this.directionalSides[0]}`],
				this.map[`team_${this.directionalSides[1]}`],
			]
		},
	},

	methods: {
		playPostMatchOutro() {
			this.cancelPostMatchOutro()

			this.$nextTick(() => {
				this.active =  true

				this.audio = new Audio(this.musicBlobUrl)
				this.audio.play()

				this.unsetActiveTimeout = setTimeout(() => this.cancelPostMatchOutro(false), 20000)
			})
		},

		cancelPostMatchOutro(stopAudio = true) {
			clearTimeout(this.unsetActiveTimeout)
			this.unsetActiveTimeout = null

			this.active = false

			if (stopAudio && this.audio) {
				this.audio.pause()
				this.audio = null
			}
		},

		updateMusicBlobUrl() {
			if (! this.postMatchOutroMusicPath) return

			const blob = new Blob([fs.readFileSync(this.postMatchOutroMusicPath)])
			this.musicBlobUrl = URL.createObjectURL(blob)
		},
	},

	watch: {
		impulse(impulse) {
			switch (impulse) {
				case 'playPostMatchOutro': return this.playPostMatchOutro()
				case 'cancelPostMatchOutro': return this.cancelPostMatchOutro()
			}
		},

		timers(timers) {
			if (! this.autoplayPostMatchAnimations) return

			if (timers.phase === 'over' && timers.phase_ends_in < 0) {
				if (! this.postMatchOutroAlreadyPlayed && ! this.active) {
					this.playPostMatchOutro()
					this.postMatchOutroAlreadyPlayed = true
				}
			} else {
				this.postMatchOutroAlreadyPlayed = false
			}
		},

		postMatchOutroMusicPath() {
			this.updateMusicBlobUrl()
		},
	},
}
</script>
