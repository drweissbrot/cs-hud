export default {
	props: [
		'colorClass',
		'direction',
		'max',
		'min',
		'skew',
		'value',
	],

	computed: {
		styleAttr() {
			const min = this.min || 0
			const max = this.max ?? 1

			const percent = (this.value - min) / (max - min)

			return `transform: scaleX(${percent})`
		},

		skewedClass() {
			switch (this.skew) {
				case 'left': return '--skewed-left'
				case 'right': return '--skewed-right'
				default: return ''
			}
		},
	},
}
