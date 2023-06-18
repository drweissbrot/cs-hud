// needs to be a `function` so `this` is the Vue component
export function positionClass() {
	return `--${this.position}`
}
