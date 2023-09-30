import { bombsites, gsiState } from '/hud/core/state.js'
import { insideVector } from '/hud/helpers/inside-vector.js'
import { vectorDistance } from '/hud/helpers/vector-distance.js'

export const findBombsite = (position) => {
	const bombsiteConfig = bombsites[gsiState.map.name] || bombsites[gsiState.map.name.replace(/^.+\//, '')]
	if (! bombsiteConfig) return

	let leastDistance = null
	let leastDistanceTo = null

	for (const [bombsite, { center, minimum, maximum }] of Object.entries(bombsiteConfig)) {
		if (insideVector(position, minimum, maximum)) return bombsite

		const distance = vectorDistance(center, position)
		if (leastDistance === null || distance < leastDistance) {
			leastDistance = distance
			leastDistanceTo = bombsite
		}
	}

	if (leastDistanceTo) return leastDistanceTo
}
