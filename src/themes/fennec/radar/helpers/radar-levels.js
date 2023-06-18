// needs to be a `function` so `this` is the Vue component
export function levels() {
	if (! this.radarConfig.verticalsections) return [-Infinity, 'default']

	return Object.entries(this.radarConfig.verticalsections).map(([level, { AltitudeMin }]) => [level, AltitudeMin])
}

// needs to be a function so `this` is the Vue component
export function getLevel(z) {
	if (this.levels.length < 2) return 'default'

	const level = this.levels.find((level) => level[1] < z)
	if (! level) return 'default'

	return level[0]
}
