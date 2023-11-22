import { getLevel, levels } from '/hud/radar/helpers/radar-levels.js'
import { offsetX, offsetY } from '/hud/radar/helpers/radar-offset.js'
import { radarConfig } from '/hud/radar/helpers/radar-config.js'
import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	data() {
		return {
			initialPosition: [],
		}
	},

	props: [
		'player',
	],

	computed: {
		levels,
		radarConfig,

		colorClass() {
			return teamColorClass(this.player.team)
		},

		coordinates() {
			if (this.initialPosition.length == 0) {
				this.initialPosition = this.player.position
			}


			return {
				x: this.offsetX(this.initialPosition[0]),
				y: this.offsetY(this.initialPosition[1]),
			}
		},

		level() {
			return this.getLevel(this.initialPosition[2])
		},
	},

	methods: {
		getLevel,
		offsetX,
		offsetY,
	},
}
