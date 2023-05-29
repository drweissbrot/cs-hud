export default {
	props: [
		'colorClass',
		'direction',
		'max',
		'min',
		'value',
	],

	computed: {
		styleAttr() {
			const min = this.min || 0
			const max = this.max ?? 1

			const percent = (this.value - min) / (max - min)

			return `transform: scaleX(${percent})`
		},
	},
}
