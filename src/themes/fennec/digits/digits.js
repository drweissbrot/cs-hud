export default {
	props: [
		'digits',
		'pad',
		'value',
	],

	computed: {
		elements() {
			return `${this.value}`.padStart(this.digits, this.pad ?? ' ').split('')
		},
	},
}
