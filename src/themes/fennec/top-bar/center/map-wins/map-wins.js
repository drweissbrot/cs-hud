import { positionClass } from '/hud/helpers/position-class.js'
import { seriesMapNumbers } from '/hud/helpers/series-map-numbers.js'
import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	props: [
		'position',
		'team',
	],

	computed: {
		positionClass,

		colorClass() {
			return teamColorClass(this.team)
		},

		pips() {
			const mapNumbers = this.seriesMapNumbers()
			const pips = []

			for (const mapNumber of mapNumbers) {
				const scoreA = this.$opts[`series.maps.${mapNumber}.pickTeamScore`]
				const scoreB = this.$opts[`series.maps.${mapNumber}.enemyTeamScore`]
				const pickedByTeamName = this.$opts[`series.maps.${mapNumber}.pickTeam`]

				if (pickedByTeamName === this.team.name) {
					if (scoreA > scoreB) pips.push(true)
				} else if (scoreB > scoreA) pips.push(true)
			}

			const maxMapWins = Math.floor(mapNumbers.length / 2) + 1
			return [...pips, ...new Array(maxMapWins - pips.length).fill(false)]
		},
	},

	methods: {
		seriesMapNumbers,
	},
}
