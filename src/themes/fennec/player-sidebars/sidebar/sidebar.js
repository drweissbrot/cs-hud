import Player from '/hud/player-sidebars/sidebar/player/player.vue'
import TeamEquipment from '/hud/player-sidebars/sidebar/team-equipment/team-equipment.vue'
import TeamGrenades from '/hud/player-sidebars/sidebar/team-grenades/team-grenades.vue'

export default {
	props: [
		'position',
		'team',
	],

	components: {
		Player,
		TeamEquipment,
		TeamGrenades,
	},

	computed: {
		positionClass() {
			return `--${this.position}`
		},
	}
}
