import { averagePreviousPositions, rememberPosition } from '/hud/radar/helpers/previous-positions.js'
import { getLevel, levels } from '/hud/radar/helpers/radar-levels.js'
import { offsetX, offsetY } from '/hud/radar/helpers/radar-offset.js'
import { radarConfig } from '/hud/radar/helpers/radar-config.js'

export default {
	data() {
		return {
			previousPositions: [],
		}
	},

	props: [
		'player',
	],

	computed: {
		levels,
		radarConfig,

		coordinates() {
			this.rememberPosition(this.$bomb)
			const [x, y, z] = this.averagePreviousPositions()

			return {
				z,
				x: this.offsetX(x),
				y: this.offsetY(y),
			}
		},

		level() {
			return this.getLevel(this.coordinates.z)
		},

		level() {
			return this.getLevel(this.$bomb.position[2])
		},
	},

	methods: {
		averagePreviousPositions,
		getLevel,
		offsetX,
		offsetY,
		rememberPosition,
	},
}
