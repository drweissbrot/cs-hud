import { getLevel, levels } from '/hud/radar/helpers/radar-levels.js'
import { offsetX, offsetY } from '/hud/radar/helpers/radar-offset.js'
import { radarConfig } from '/hud/radar/helpers/radar-config.js'
import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
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
			return {
				x: this.offsetX(this.player.position[0]),
				y: this.offsetY(this.player.position[1]),
			}
		},

		level() {
			return this.getLevel(this.player.position[2])
		},
	},

	methods: {
		getLevel,
		offsetX,
		offsetY,
	},
}
