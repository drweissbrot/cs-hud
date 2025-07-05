// needs to be a `function` so `this` is the Vue component
export function seriesMapNumbers() {
	const mapNumbers = new Set()

	for (const [key, value] of Object.entries(this.$opts)) {
		if (! key.startsWith('series.maps.')) continue
		if (! value && value !== 0) continue

		const mapNumber = Number(key.substring(12).split('.', 2)[0])
		mapNumbers.add(mapNumber)
	}

	return [...mapNumbers].sort((a, b) => a - b)
}
