<template>
	<div v-if="active && series && series.length" class="post-match-outro">
		<Marquees />
		<GenericBackground />

		<div :class="['series --active', { '--completed': seriesCompleted }]">
			<PostMatchOutroSeriesMatch
				v-for="(match, index) in series"
				:isComingUpNext="! seriesCompleted && series[index - 1] && series[index - 1].currentlyPlaying"
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
		URL.revokeObjectURL(this.musicBlobUrl)
	},

	computed: {
		...mapGetters([
			'autoplayPostMatchAnimations',
			'impulse',
			'map',
			'map',
			'postMatchOutroMusicPath',
			'series',
		]),

		seriesCompleted() {
			const matchWinsRequiredToWinSeries = Math.ceil(this.series.length / 2)

			let winsLeft = 0
			let winsRight = 0

			for (const { currentlyPlaying, scoreLeft, scoreRight } of this.series) {
				if (currentlyPlaying) {
					if (this.teams[0].score > this.teams[1].score) winsLeft++
					else if (this.teams[1].score > this.teams[0].score) winsRight++
				} else {
					if (scoreLeft > scoreRight) winsLeft++
					else if (scoreRight > scoreLeft) winsRight++
				}
			}

			return winsLeft >= matchWinsRequiredToWinSeries || winsRight >= matchWinsRequiredToWinSeries
		},

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

		map(map, previously) {
			if (! this.autoplayPostMatchAnimations) return

			if (map.phase === 'gameover') {
				if (previously.phase !== 'gameover' && ! this.postMatchOutroAlreadyPlayed && ! this.active) {
					this.postMatchOutroAlreadyPlayed = true
					setTimeout(() => this.playPostMatchOutro(), 2000)
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
