<template>
	<div v-if="active && series && series.length" class="pre-match-intro">
		<div v-for="location in ['top', 'bottom']" :class="`marquee --${location}`">
			<template v-for="i in 20">
				<img src="../../img/skillgroups/wingman1.svg" alt="">
				<img src="../../img/wheelchair-man/white.svg" alt="">
				<img src="../../img/skillgroups/wingman1.svg" alt="">
				<img class="large" :src="require('../../img/condom-man.png').default" alt="">
				<img src="../../img/skillgroups/wingman1.svg" alt="">
				<img class="large" :src="require('../../img/straight-outta-silver.png').default" alt="">
			</template>
		</div>

		<video
			class="generic-background"
			:src="require('../../img/pre-match-intro-background.mp4').default"
			autoplay
		></video>
		<div class="generic-background-blur"></div>

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

		<div class="skillgroups">
			<img v-for="i in 18" class="skillgroup" :src="require(`../../img/skillgroups/skillgroup${19 - i}.svg`)" alt="">
		</div>

		<div class="logo">
			<div class="inner">
				<div class="csgo">
					Counter-Strike<br>
					Global Offensive
				</div>

				<img class="wheelchair-man" :src="require('../../img/wheelchair-man/orange.svg')" alt="">

				<div class="paralympics">
					Paralympics
				</div>

				<div v-if="seriesName.length === 1 || seriesName.length === 3" class="meta">
					<div>{{ seriesName[0] }}</div>
					<div class="center">{{ seriesNumber || (seriesName.length === 1 ? seriesName[0] : seriesName[1]) }}</div>
					<div>{{ seriesName[2] }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import flagStyle from '../flag-style'
import formatMapName from '../map-names'

export default {
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
			'seriesName',
			'seriesNumber',
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

				this.audio = new Audio(require('../../img/pre-match-intro-music.mp3').default)
				this.audio.play()

				this.unsetActiveTimeout = setTimeout(() => this.cancelPreMatchIntro(false), 16000)
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
