import AlivePlayer from '/hud/radar/player/alive-player/alive-player.vue'
import DeadPlayer from '/hud/radar/player/dead-player/dead-player.vue'

export default {
	props: [
		'player',
	],

	components: {
		AlivePlayer,
		DeadPlayer,
	},
}
