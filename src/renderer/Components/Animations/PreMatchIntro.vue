<template>
	<div v-if="active && series && series.length" class="pre-match-intro">
		<Marquees />
		<GenericBackground />

		<div class="series --active">
			<div
				v-for="match in series"
				:class="['match', { '--currently-playing': match.currentlyPlaying }]"
				:style="{ maxWidth: `${100 / series.length}vw` }"
			>
				<div class="inner" :style="{ maxWidth: `${100 / series.length}vw` }">
					<div :class="`map --${match.map}`"></div>

					<div
						v-if="match.scoreLeft > match.scoreRight && teams[0].flag"
						:class="`winner-flag-background ${flagStyle(teams[0].flag)}`"
						:style="{ backgroundImage: `url(https://flagcdn.com/${teams[0].flag.toLowerCase()}.svg)` }"
					></div>

					<div
						v-else-if="match.scoreRight > match.scoreLeft && teams[1].flag"
						:class="`winner-flag-background ${flagStyle(teams[1].flag)}`"
						:style="{ backgroundImage: `url(https://flagcdn.com/${teams[1].flag.toLowerCase()}.svg)` }"
					></div>

					<div class="text">
						<div class="map-name">{{ formatMapName(match.map) }}</div>

						<div class="result">
							<template v-if="match.scoreLeft || match.scoreRight">
								<img v-if="teams[0].flag" :src="`https://flagcdn.com/${teams[0].flag.toLowerCase()}.svg`">
								{{ match.scoreLeft }} : {{ match.scoreRight }}
								<img v-if="teams[1].flag" :src="`https://flagcdn.com/${teams[1].flag.toLowerCase()}.svg`">
							</template>

							<template v-else-if="match.currentlyPlaying">
								Now Playing
							</template>

							<template v-else>&nbsp;</template>
						</div>

						<div class="pick-heading">{{ match.picked ? 'Pick' : 'Decider' }}</div>
						<div class="pick-team">{{ match.picked ? teams[match.picked].name || '&nbsp;' : '&nbsp;' }}</div>
					</div>
				</div>
			</div>
		</div>

		<Skillgroups />
		<Logo />
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import flagStyle from '../../flag-style'
import formatMapName from '../../map-names'
import GenericBackground from './GenericBackground'
import Logo from './Logo'
import Marquees from './Marquees'
import Skillgroups from './Skillgroups'

export default {
	components: {
		GenericBackground,
		Logo,
		Marquees,
		Skillgroups,
	},

	props: [
		'directionalSides',
	],

	data() {
		return {
			audio: null,
			active: false,
			unsetActiveTimeout: null,
		}
	},

	computed: {
		...mapGetters([
			'impulse',
			'map',
			'series',
		]),

		teams() {
			return [
				this.map[`team_${this.directionalSides[0]}`],
				this.map[`team_${this.directionalSides[1]}`],
			]
		},
	},

	methods: {
		flagStyle,
		formatMapName,

		playPreMatchIntro() {
			this.cancelPreMatchIntro()

			this.$nextTick(() => {
				this.active =  true

				this.audio = new Audio(require('../../../img/pre-match-intro-music.mp3').default)
				this.audio.play()

				this.unsetActiveTimeout = setTimeout(() => this.cancelPreMatchIntro(false), 12000)
			})
		},

		cancelPreMatchIntro(stopAudio = true) {
			clearTimeout(this.unsetActiveTimeout)
			this.unsetActiveTimeout = null

			this.active = false

			if (stopAudio && this.audio) {
				this.audio.pause()
				this.audio = null
			}
		},
	},

	watch: {
		impulse(impulse) {
			switch (impulse) {
				case 'playPreMatchIntro': return this.playPreMatchIntro()
				case 'cancelPreMatchIntro': return this.cancelPreMatchIntro()
			}
		},
	},
}
</script>
