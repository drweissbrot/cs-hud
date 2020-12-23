<template>
	<img
		v-if="weapon"
		:src="require(`../../img/weapons/${name}.svg`)"
		:class="['weapon-icon', {
			'--force-active': active,
			'--active' : active || weapon.state === 'active',
			'--grenade': weapon.type === 'Grenade',
		}]"
	>
</template>

<script>
export default {
	props: [
		'active',
		'weapon',
	],

	computed: {
		name() {
			return this.weapon.name.replace(/^weapon_/, '')
		},
	},
}
</script>
