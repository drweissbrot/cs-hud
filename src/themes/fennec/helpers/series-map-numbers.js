// needs to be a `function` so `this` is the Vue component
export function seriesMapNumbers() {
	const mapNumbers = new Set()

	for (const key of Object.keys(this.$opts)) {
		if (key.startsWith('series.maps.')) {
			const mapNumber = Number(key.substring(12).split('.', 2)[0])
			mapNumbers.add(mapNumber)
		}
	}

	return [...mapNumbers].sort((a, b) => a - b)
}
