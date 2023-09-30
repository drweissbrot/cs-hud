// With interpolation enabled in the game, the position values GSI sends us are a bit annoying: Even if a player moves
// in a perfectly straight line, their coordinates will jump back and forth a bit with every tick.
//
// The way around this is to remember the last couple position vectors, average them out, and just display that average.
//
// Why not just disable interpolation in the game? Because that'd break a lot of the animations (even ones you'd not
// expect, like planting the bomb).

// needs to be a `function` so `this` is the Vue component
export function averagePreviousPositions() {
	let sumX = 0
	let sumY = 0
	let sumZ = 0

	for (const [x, y, z, a] of this.previousPositions) {
		sumX += x
		sumY += y
		sumZ += z
	}

	return [
		sumX / this.previousPositions.length,
		sumY / this.previousPositions.length,
		sumZ / this.previousPositions.length,
	]
}

// needs to be a `function` so `this` is the Vue component
export function rememberPosition(gameObject) {
	const [x, y, z] = gameObject.position

	this.previousPositions.push([x, y, z])

	// this used to be 8 back in v1, but 16 appears to make everything a bit smoother
	if (this.previousPositions.length > 16) {
		this.previousPositions.shift()
	}
}
