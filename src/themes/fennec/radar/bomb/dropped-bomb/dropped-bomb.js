import { getLevel, levels } from '/hud/helpers/radar-levels.js'
import { offsetX, offsetY } from '/hud/helpers/radar-offset.js'
import { radarConfig } from '/hud/helpers/radar-config.js'
import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	data() {
		return {
			previousPositions: [], // GSI sends out interpolated positions, so we have to average out the last few positions to avoid the bomb spazzing back and forth when moving
		}
	},

	props: [
		'player',
	],

	computed: {
		levels,
		radarConfig,

		coordinates() {
			this.rememberPosition()
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
		getLevel,
		offsetX,
		offsetY,
		teamColorClass,

		averagePreviousPositions() {
			let sumX = 0
			let sumY = 0
			let sumZ = 0

			for (const [x, y, z, a] of this.previousPositions) {
				sumX += x
				sumY += y
				sumZ += z
			}

			return [
				sumX / this.previousPositions.length,
				sumY / this.previousPositions.length,
				sumZ / this.previousPositions.length,
			]
		},

		rememberPosition() {
			const [x, y, z] = this.$bomb.position

			this.previousPositions.push([x, y, z])

			if (this.previousPositions.length > 16) {
				this.previousPositions.shift()
			}
		},
	},
}
