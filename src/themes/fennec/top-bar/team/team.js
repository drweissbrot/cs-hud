import { positionClass } from '/hud/helpers/position-class.js'
import BombTimer from '/hud/top-bar/team/bomb-timer/bomb-timer.vue'
import MatchPoint from '/hud/top-bar/team/match-point/match-point.vue'
import Name from '/hud/top-bar/team/name/name.vue'
import RoundWinner from '/hud/top-bar/team/round-winner/round-winner.vue'
import Timeout from '/hud/top-bar/team/timeout/timeout.vue'

export default {
	props: [
		'position',
		'team',
	],

	components: {
		BombTimer,
		MatchPoint,
		Name,
		RoundWinner,
		Timeout,
	},

	computed: {
		positionClass,
	},
}
