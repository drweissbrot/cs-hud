import Armor from '/hud/player-sidebars/sidebar/player/equipment/armor/armor.vue'
import BombOrDefuser from '/hud/player-sidebars/sidebar/player/equipment/bomb-or-defuser/bomb-or-defuser.vue'

export default {
	props: [
		'position',
		'player',
	],

	components: {
		Armor,
		BombOrDefuser,
	},

	computed: {
		positionClass() {
			return `--${this.position}`
		},
	},
}
