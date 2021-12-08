<template>
	<div class="logo">
		<div class="inner">
			<div class="csgo">
				Counter-Strike<br>
				Global Offensive
			</div>

			<img class="wheelchair-man" :src="require('../../../img/wheelchair-man/orange.svg')" alt="">

			<div class="paralympics">
				Paralympics
			</div>

			<div v-if="seriesName.length === 1 || seriesName.length === 3" class="meta">
				<div>{{ seriesName[0] }}</div>
				<div class="center">{{ seriesNumber || (seriesName.length === 1 ? seriesName[0] : seriesName[1]) }}</div>
				<div>{{ seriesName[2] }}</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters([
			'seriesName',
			'seriesNumber',
		]),
	},
}
</script>
