import { getLevel, levels } from '/hud/radar/helpers/radar-levels.js'
import { offsetX, offsetY } from '/hud/radar/helpers/radar-offset.js'
import { radarConfig } from '/hud/radar/helpers/radar-config.js'
import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	props: [
		'grenade',
	],

	computed: {
		levels,
		radarConfig,

		colorClass() {
			return teamColorClass(this.grenade.owner?.team)
		},

		coordinates() {
			return {
				x: this.offsetX(this.grenade.position[0]),
				y: this.offsetY(this.grenade.position[1]),
			}
		},

		level() {
			return this.getLevel(this.grenade.position[2])
		},
	},

	methods: {
		getLevel,
		offsetX,
		offsetY,
	},
}
