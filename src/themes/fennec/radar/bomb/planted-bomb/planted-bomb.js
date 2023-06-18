import { getLevel, levels } from '/hud/radar/helpers/radar-levels.js'
import { offsetX, offsetY } from '/hud/radar/helpers/radar-offset.js'
import { radarConfig } from '/hud/radar/helpers/radar-config.js'

export default {
	props: [
		'player',
	],

	computed: {
		levels,
		radarConfig,

		stateClass() {
			return `--${this.$bomb.state}`
		},

		coordinates() {
			return {
				x: this.offsetX(this.$bomb.position[0]),
				y: this.offsetY(this.$bomb.position[1]),
			}
		},

		level() {
			return this.getLevel(this.$bomb.position[2])
		},
	},

	methods: {
		getLevel,
		offsetX,
		offsetY,
	},
}
