<template>
	<div v-if="series.length > 1" :class="['series', { '--active': active }]">
		<div v-for="match in series" :class="['match', { '--currently-playing': match.currentlyPlaying }]">
			<RoundGraph v-if="match.currentlyPlaying" :directionalSides="directionalSides" />

			<div v-else class="result">
				<template v-if="match.scoreLeft || match.scoreRight">
					<img v-if="teams[0].flag" :src="`https://flagcdn.com/${teams[0].flag.toLowerCase()}.svg`">
					{{ match.scoreLeft }} : {{ match.scoreRight }}
					<img v-if="teams[1].flag" :src="`https://flagcdn.com/${teams[1].flag.toLowerCase()}.svg`">
				</template>

				<template v-else>&nbsp;</template>
			</div>

			<div class="inner">
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
					<div class="pick-heading">{{ match.picked ? 'Pick' : 'Decider' }}</div>
					<div class="pick-team">{{ match.picked ? teams[match.picked].name || '&nbsp;' : '&nbsp;' }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import flagStyle from '../flag-style'
import RoundGraph from './RoundGraph'

const mapNames = {
	de_cbble: 'Cobblestone',
	de_dust2: 'Dust 2',
}

export default {
	components: {
		RoundGraph,
	},

	props: [
		'directionalSides',
	],

	computed: {
		...mapGetters([
			'map',
			'series',
			'timers',
		]),

		active() {
			return this.map.phase === 'intermission'
				|| ['paused', 'timeout_ct', 'timeout_t', 'freezetime'].includes(this.timers.phase)
		},

		teams() {
			return [
				this.map[`team_${this.directionalSides[0]}`],
				this.map[`team_${this.directionalSides[1]}`],
			]
		},
	},

	methods: {
		flagStyle,

		formatMapName(mapName) {
			return (mapNames.hasOwnProperty(mapName))
				? mapNames[mapName]
				: mapName.split('/').pop().split('_', 2).pop()
		},
	},
}
</script>
