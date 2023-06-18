import { getLevel, levels } from '/hud/helpers/radar-levels.js'
import { offsetX, offsetY } from '/hud/helpers/radar-offset.js'
import { radarConfig } from '/hud/helpers/radar-config.js'
import { teamColorClass } from '/hud/helpers/team-color-class.js'
import { vectorDistance } from '/hud/gsi/helpers/vector-distance.js'

export default {
	data() {
		return {
			previousPositionsAndAngles: [], // GSI sends out interpolated positions, so we have to average out the last few positions to avoid players spazzing back and forth when moving
		}
	},

	props: [
		'player',
	],

	computed: {
		levels,
		radarConfig,

		colorClass() {
			return this.teamColorClass(this.player.team)
		},

		coordinates() {
			const angle = this.getAngle()
			this.rememberPositionAndAngle(angle)

			const [x, y, z, a] = this.averagePreviousPositionsAndAngles()

			return {
				z,

				angle: a,
				x: this.offsetX(x),
				y: this.offsetY(y),
			}
		},

		level() {
			return this.getLevel(this.coordinates.z)
		},

		zIndex() {
			if (this.player.isFocused) return 8000000
			return 1000000 + Math.round(this.coordinates.z)
		},
	},

	methods: {
		getLevel,
		offsetX,
		offsetY,
		teamColorClass,

		getAngle() {
			const [x, y] = this.player.forward

			const radians = Math.atan2(x, y)
			const degrees = 180 * radians / Math.PI

			return (360 + Math.round(degrees)) % 360
		},

		averagePreviousPositionsAndAngles() {
			let sumX = 0
			let sumY = 0
			let sumZ = 0
			let sumA = 0

			let anglesBetween0And90 = 0
			let anglesBetween270And360 = 0

			for (const [x, y, z, a] of this.previousPositionsAndAngles) {
				sumX += x
				sumY += y
				sumZ += z
				sumA += a

				if (a >= 0 && a <= 90) anglesBetween0And90++
				else if (a >= 270 && a <= 360) anglesBetween270And360++
			}

			if (anglesBetween0And90 && anglesBetween270And360) {
				sumA -= anglesBetween270And360 * 360
			}

			return [
				sumX / this.previousPositionsAndAngles.length,
				sumY / this.previousPositionsAndAngles.length,
				sumZ / this.previousPositionsAndAngles.length,
				sumA / this.previousPositionsAndAngles.length,
			]
		},

		rememberPositionAndAngle(angle) {
			const [x, y, z] = this.player.position

			// if players teleport across the map (e.g. at the beginning of a freezetime), clear the previous positions array first
			if (this.previousPositionsAndAngles.length > 1) {
				const distance = vectorDistance(this.previousPositionsAndAngles[this.previousPositionsAndAngles.length - 1], [x, y, z])

				if (distance > 128) {
					this.previousPositionsAndAngles.splice(0)
				}
			}

			this.previousPositionsAndAngles.push([x, y, z, angle])

			if (this.previousPositionsAndAngles.length > 16) {
				this.previousPositionsAndAngles.shift()
			}
		},
	},
}
