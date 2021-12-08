<template>
	<div class="top-bar-wrapper">
		<!-- TODO angles for theses ones are a bit broken on 2560x1080px -->
		<div v-if="seriesName && (seriesName.length === 1 || seriesName.length === 3)" class="series-name">
			<div v-if="seriesName.length === 3" class="left">
				<div class="inner">{{ seriesName[0] }}</div>
			</div>

			<div class="center">
				<div class="inner">{{ seriesName.length === 1 ? seriesName[0] : seriesName[1] }}</div>
			</div>

			<div v-if="seriesName.length === 3" class="right">
				<div class="inner">{{ seriesName[2] }}</div>
			</div>
		</div>

		<div class="top-bar">
			<template v-for="(team, direction) in { left, right }">
				<div :class="`team-color-patch --${direction}`">
					<div :class="`inner --${directionalSides[Number(direction === 'right')]}`"></div>
				</div>

				<div :class="`flag-wrapper --${direction}`">
					<div
						:class="`flag ${flagStyle(team.flag)} --${directionalSides[Number(direction === 'right')]}`"
						:style="{ backgroundImage: team.flag && `url('https://flagcdn.com/${team.flag.toLowerCase()}.svg')` }"
					></div>
				</div>

				<div :class="`team-name --${direction} --${directionalSides[Number(direction === 'right')]}`">
					{{ team.name || (directionalSides[Number(direction === 'right')] === 'ct' ? 'Counter-Terrorists' : 'Terrorists') }}
				</div>

				<div :class="`round-wins --${direction}`">
					<div :class="`diagonal --${directionalSides[Number(direction === 'right')]}`"></div>
					<div :class="`inner --${directionalSides[Number(direction === 'right')]}`">{{ team.score }}</div>
				</div>

				<div v-if="seriesData.bestOf !== 1" :class="`map-wins --${direction}`">
					<div class="diagonal-wrapper">
						<div class="diagonal"></div>
					</div>

					<div class="pips">
						<div
							v-for="i in Math.floor(seriesData.bestOf / 2 + 1)"
							:class="[`pip --${directionalSides[Number(direction === 'right')]}`, { '--filled': seriesData.wins[direction] >= i }]"
						/>
					</div>
				</div>

				<div :class="`special --${direction} --${directionalSides[Number(direction === 'right')]}`">
					<MatchPoint :direction="direction" :side="directionalSides[Number(direction === 'right')]" />
					<Timeout :direction="direction" :side="directionalSides[Number(direction === 'right')]" :team="team" />
					<BombTimer :direction="direction" :side="directionalSides[Number(direction === 'right')]" />
				</div>
			</template>

			<Clock />

			<div class="map-no" v-if="seriesData.bestOf !== 1">
				Map
				{{ seriesData.wins.left + seriesData.wins.right + 1 }}
				of
				{{ seriesData.bestOf }}
			</div>

			<div :class="['first-to-rounds', { '--active': freezetime && half > 2 }]">
				<div class="diagonal-wrapper">
					<div class="diagonal --left"></div>
				</div>

				<div class="inner">
					First to {{ roundsForMatchPoint + 1 }} Rounds
				</div>

				<div class="diagonal-wrapper">
					<div class="diagonal --right"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import bombsites from '../bombsites.js'
import BombTimer from './BombTimer'
import Clock from './Clock'
import flagStyle from '../flag-style'
import MatchPoint from './MatchPoint'
import Timeout from './Timeout'

export default {
	components: {
		BombTimer,
		Clock,
		MatchPoint,
		Timeout,
	},

	props: [
		'directionalSides',
	],

	methods: {
		flagStyle,
	},

	computed: {
		...mapGetters([
			'map',
			'series',
			'seriesName',
			'timers',
		]),

		left() {
			return this.map[`team_${this.directionalSides[0]}`]
		},

		right() {
			return this.map[`team_${this.directionalSides[1]}`]
		},

		seriesData() {
			if (this.series.length < 1) {
				return {
					bestOf: Math.max(this.map.num_matches_to_win_series * 2 - 1, 1),
					wins: {
						left: this.left.matches_won_this_series,
						right: this.right.matches_won_this_series,
					},
				}
			}

			return {
				bestOf: this.series.length,
				wins: {
					left: this.series.reduce((wins, match) => wins + (match.scoreLeft > match.scoreRight), 0),
					right: this.series.reduce((wins, match) => wins + (match.scoreLeft < match.scoreRight), 0),
				},
			}
		},

		roundsForMatchPoint() {
			return (this.half < 3)
				? 15
				: Math.floor((this.half - (this.half % 2 === 0 ? 1 : 0)) / 2) * 3 + 15
		},

		half() {
			if (this.map.round < 15) return 1
			if (this.map.round < 30) return 2

			return 2 + Math.ceil((this.map.round - 29) / 3)
		},

		freezetime() {
			return ['paused', 'timeout_ct', 'timeout_t', 'freezetime'].includes(this.timers.phase)
		},
	},
}
</script>
