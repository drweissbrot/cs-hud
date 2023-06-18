import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	props: [
		'position',
		'team',
	],

	computed: {
		colorClass() {
			return teamColorClass(this.team)
		},

		positionClass() {
			return `--${this.position}`
		},

		pips() {
			const mapNumbers = new Set()

			for (const key of Object.keys(this.$opts)) {
				if (key.startsWith('series.maps.')) mapNumbers.add(key.substring(12).split('.', 2)[0])
			}

			const pips = []

			for (const mapNumber of mapNumbers) {
				const scoreA = this.$opts[`series.maps.${mapNumber}.pickTeamScore`]
				const scoreB = this.$opts[`series.maps.${mapNumber}.enemyTeamScore`]
				const pickedByTeamName = this.$opts[`series.maps.${mapNumber}.pickTeam`]

				if (pickedByTeamName === this.team.name) {
					if (scoreA > scoreB) pips.push(true)
				} else if (scoreB > scoreA) pips.push(true)
			}

			const maxMapWins = Math.floor(mapNumbers.size / 2) + 1
			return [...pips, ...new Array(maxMapWins - pips.length).fill(false)]
		},
	},
}
