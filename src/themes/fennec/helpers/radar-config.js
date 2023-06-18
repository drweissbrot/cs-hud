// needs to be a `function` so `this` is the Vue component
export function radarConfig() {
	return this.$radars[this.$map.name] || this.$radars[this.$map.sanitizedName]
}
