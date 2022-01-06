<template>
	<div
		:class="['match', {
			'--currently-playing': match.currentlyPlaying,
			'--is-coming-up-next': isComingUpNext,
		}]"
		:style="{ maxWidth: `${100 / seriesLength}vw` }"
	>
		<div class="inner" :style="{ maxWidth: `${100 / seriesLength}vw` }">
			<div :class="`map --${match.map}`"></div>

			<div
				v-if="winnerFlag"
				:class="`winner-flag-background ${flagStyle(winnerFlag)}`"
				:style="{ backgroundImage: `url(https://flagcdn.com/${winnerFlag.toLowerCase()}.svg)` }"
			></div>

			<div class="text">
				<div class="map-name">{{ formatMapName(match.map) }}</div>

				<div class="result">
					<template v-if="scoreLeft || scoreRight">
						<img v-if="teams[0].flag" :src="`https://flagcdn.com/${teams[0].flag.toLowerCase()}.svg`">
						{{ scoreLeft }} : {{ scoreRight }}
						<img v-if="teams[1].flag" :src="`https://flagcdn.com/${teams[1].flag.toLowerCase()}.svg`">
					</template>

					<template v-else-if="isComingUpNext">
						Up Next
					</template>

					<template v-else>&nbsp;</template>
				</div>

				<div class="pick-heading">{{ match.picked ? 'Pick' : 'Decider' }}</div>
				<div class="pick-team">{{ match.picked ? teams[match.picked].name || '&nbsp;' : '&nbsp;' }}</div>
			</div>
		</div>
	</div>
</template>

<script>
import flagStyle from '../../flag-style'
import formatMapName from '../../map-names'

export default {
	props: [
		'match',
		'seriesLength',
		'teams',
		'isComingUpNext',
	],

	computed: {
		scoreLeft() {
			return (this.match.currentlyPlaying)
				? this.teams[0].score
				: this.match.scoreLeft
		},

		scoreRight() {
			return (this.match.currentlyPlaying)
				? this.teams[1].score
				: this.match.scoreRight
		},

		winnerFlag() {
			if (this.scoreLeft > this.scoreRight) return this.teams[0].flag
			if (this.scoreLeft < this.scoreRight) return this.teams[1].flag
		},
	},

	methods: {
		flagStyle,
		formatMapName,
	},
}
</script>
