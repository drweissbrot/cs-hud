<template>
	<div :class="['series', { '--active': map.phase === 'intermission' || ['paused', 'timeout_ct', 'timeout_t', 'freezetime'].includes(timers.phase) }]">
		<div class="label --picked">Picked</div>
		<div class="label --winner">Winner</div>
		<div class="label --score">Score</div>

		TODO
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters([
			'map',
			'timers',
		]),
	},
}
</script>
