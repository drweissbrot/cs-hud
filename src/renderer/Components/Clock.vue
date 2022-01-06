<template>
	<div class="clock">
		<div :class="['time', {
			'--red': ! ['bomb', 'defuse', 'over'].includes(timers.phase) && timers.phase_ends_in <= 10,
		}]">
			<img v-if="timers.phase === 'paused'" src="../../img/pause.svg">

			<template v-else-if="map.phase === 'live' || map.phase === 'intermission'">
				<div class="images" v-if="['bomb', 'defuse'].includes(timers.phase)">
					<div class="img --c4" v-html="image(require('../../img/bomb_c4.svg'))" />

					<div v-if="bombPlantedOnSite === 'a'" class="img" v-html="image(require('../../img/map_bombzone_a.svg'))" />
					<div v-else-if="bombPlantedOnSite === 'b'" class="img" v-html="image(require('../../img/map_bombzone_b.svg'))" />
				</div>

				<template v-else>
					<span v-for="digit in formattedRoundTimer" :class="{ 'digit': !isNaN(digit) }">{{ digit }}</span>
				</template>
			</template>

			<div v-else-if="map.phase === 'warmup'" class="warmup">
				Warmup
			</div>
		</div>

		<div class="round-no">
			<template v-if="map.round < 30">
				Round {{ map.round + 1 - Number(timers.phase === 'over') }}/30
			</template>

			<template v-else>
				OT
				{{ Math.ceil((map.round - 29) / 6) }}
				Round
				{{
					Math.max(1, map.round - 29 - ((Math.ceil((map.round - 29) / 6) - 1) * 6) - Number(timers.phase === 'over'))
				}}/6
			</template>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import bombsites from '../bombsites'

export default {
	methods: {
		image(str) {
			return decodeURIComponent(str.replace(/^data:image\/svg\+xml,/, ''))
		},
	},

	computed: {
		...mapGetters([
			'bomb',
			'map',
			'timers',
		]),

		bombPlantedOnSite() {
			if (! this.bomb || ! this.bomb.position) return

			const mapName = this.map.name.replace(/^.*\//, '')

			if (! bombsites.hasOwnProperty(mapName)) return

			let leastDistance = false
			let leastDistanceTo = false

			for (const site in bombsites[mapName]) {
				const [center, min, max] = bombsites[mapName][site]
				const [x, y, z] = this.bomb.position.split(', ')

				if (x >= min.x && x <= max.x && y >= min.y && y <= max.y && z >= min.z && z <= max.z) return site

				const distance = Math.sqrt(Math.pow(center.x - x, 2),Math.pow(center.y - y, 2),Math.pow(center.z - z, 2))

				if (leastDistance === false || distance < leastDistance) {
					leastDistance = distance
					leastDistanceTo = site
				}
			}

			if (leastDistanceTo !== false) return leastDistanceTo
		},

		formattedRoundTimer() {
			if (! this.timers.phase_ends_in) return

			const time = Math.ceil(this.timers.phase_ends_in)

			if (time < 10) return `0:0${time}`
			if (time < 60) return `0:${time}`
			if (time < 70) return `1:0${time - 60}`
			return `1:${time - 60}`
		},
	},
}
</script>
