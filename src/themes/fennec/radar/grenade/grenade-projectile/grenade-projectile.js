import { averagePreviousPositions, rememberPosition } from '/hud/radar/helpers/previous-positions.js'
import { getLevel, levels } from '/hud/radar/helpers/radar-levels.js'
import { offsetX, offsetY } from '/hud/radar/helpers/radar-offset.js'
import { radarConfig } from '/hud/radar/helpers/radar-config.js'
import { teamColorClass } from '/hud/helpers/team-color-class.js'

export default {
	data() {
		return {
			previousPositions: [],
		}
	},

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
			this.rememberPosition(this.grenade)
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

		grenadeIconName() {
			switch (this.grenade.type) {
				case 'decoy': return 'decoy'
				case 'firebomb': return this.grenade.firebombType || 'molotov'
				case 'flashbang': return 'flashbang'
				case 'frag': return 'hegrenade'
				case 'smoke': return 'smokegrenade'
			}
		},

		grenadeIconUrl() {
			return `/hud/img/weapons/${this.grenadeIconName}.svg`
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
