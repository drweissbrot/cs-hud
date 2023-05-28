export default {
	props: [
		'value',
		'digits',
	],

	computed: {
		elements() {
			return `${this.value}`.padStart(this.digits, ' ').split('')
		},
	},
}
