import GrenadeProjectile from '/hud/radar/grenade/grenade-projectile/grenade-projectile.vue'
import Inferno from '/hud/radar/grenade/inferno/inferno.vue'
import Smoke from '/hud/radar/grenade/smoke/smoke.vue'

export default {
	props: [
		'grenade',
	],

	components: {
		GrenadeProjectile,
		Inferno,
		Smoke,
	},
}
