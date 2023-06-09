export default {
	props: [
		'position',
		'player',
	],

	computed: {
		positionClass() {
			return `--${this.position}`
		},
	},
}
