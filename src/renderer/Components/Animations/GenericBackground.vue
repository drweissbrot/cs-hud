<template>
	<div>
		<video class="generic-background" :src="videoBlobUrl" autoplay></video>
		<div class="generic-background-blur"></div>
	</div>
</template>

<script>
import * as fs from 'fs'
import { mapGetters } from 'vuex'

export default {
	data() {
		return {
			videoBlobUrl: null,
		}
	},

	mounted() {
		this.updateVideoBlobUrl()
	},

	beforeDestory() {
		URL.revokeObjectURL(this.videoBlobUrl)
	},

	computed: {
		...mapGetters([
			'animationsGenericBackgroundVideoPath',
		]),
	},

	methods: {
		updateVideoBlobUrl() {
			if (! this.animationsGenericBackgroundVideoPath) return

			const blob = new Blob([fs.readFileSync(this.animationsGenericBackgroundVideoPath)])
			this.videoBlobUrl = URL.createObjectURL(blob)
		},
	},

	watch: {
		animationsGenericBackgroundVideoPath() {
			this.updateVideoBlobUrl()
		},
	},
}
</script>
