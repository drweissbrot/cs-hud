<template>
	<div>
		<div v-for="location in ['top', 'bottom']" :class="`marquee --${location}`">
			<template v-for="i in 20">
				<img src="../../../img/skillgroups/wingman1.svg" alt="">
				<img src="../../../img/wheelchair-man/white.svg" alt="">
				<img src="../../../img/skillgroups/wingman1.svg" alt="">
				<img class="large" :src="require('../../../img/condom-man.png').default" alt="">
				<img src="../../../img/skillgroups/wingman1.svg" alt="">
				<img class="large" :src="require('../../../img/straight-outta-silver.png').default" alt="">
			</template>
		</div>
	</div>
</template>

<script>
export default {
	//
}
</script>
