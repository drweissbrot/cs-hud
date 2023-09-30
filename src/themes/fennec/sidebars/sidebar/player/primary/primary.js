import { positionClass } from '/hud/helpers/position-class.js'

export default {
	props: [
		'position',
		'player',
	],

	computed: {
		positionClass,

		iconUrl() {
			return `/hud/img/weapons/${this.player.primary.unprefixedName}.svg`
		},
	},
}
