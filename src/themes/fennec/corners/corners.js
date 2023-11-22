export default {
	data() {
		return {
			isRequested: new URL(window.location).searchParams.has('corners'),
		}
	},
}
