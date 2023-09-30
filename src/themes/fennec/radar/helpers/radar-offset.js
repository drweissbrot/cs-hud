// needs to be a `function` so `this` is the Vue component
export function offsetX(x) {
	return ((x - this.radarConfig.pos_x) / this.radarConfig.scale) / 1024 * 100
}

// needs to be a function so `this` is the Vue component
export function offsetY(y) {
	return ((y - this.radarConfig.pos_y) / -this.radarConfig.scale) / 1024 * 100
}
