import Bomb from '/hud/radar/bomb/bomb.vue'

export default {
	components: {
		Bomb,
	},

	computed: {
		radarConfig() {
			return this.$radars[this.$map.name] || this.$radars[this.$map.sanitizedName]
		},

		radarImageUrl() {
			return this.radarConfig?.radarImageUrl || `/hud/img/radars/ingame/${this.$map.sanitizedName}.webp`
		},
	},
}
