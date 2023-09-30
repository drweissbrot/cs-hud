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

		flames() {
			const colorClass = teamColorClass(this.grenade.owner?.team)

			return this.grenade.flames.map((flame) => ({
				colorClass,

				id: flame.id,
				level: this.getLevel(flame.position[2]),
				x: this.offsetX(flame.position[0]),
				y: this.offsetY(flame.position[1]),
			}))
		},
	},

	methods: {
		getLevel,
		offsetX,
		offsetY,
	},
}
