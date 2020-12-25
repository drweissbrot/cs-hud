<template>
	<div v-if="map && map.name" class="minimap">
		<img ref="image" :src="mapImage" @load="onResize">

		<template v-if="imageHeight !== null">
			<div
				v-for="player in players"
				:class="[`player-dot --${player.team}`, {
					'--bomb': player.bomb,
					'--dead': player.dead,
					'--focused': focusedPlayer && focusedPlayer.observer_slot === player.slot,
					'--lower': player.level === 'lower',
				}]"
				:style="{ transform: `translate(${player.x}px, ${player.y}px)` }"
			>
				<template v-if="! player.dead">
					{{ player.slot }}

					<div class="triangle-circle" :style="{ transform: `rotateZ(${player.angle}deg)` }">
						<div class="triangle" />
					</div>
				</template>

				<div v-else v-html="image(require('../../img/map-death.svg'))" />
			</div>

			<div
				v-for="grenade in grenades" :key="grenade.id"
				:class="[`grenade --${grenade.team}`, {
					'--lower': grenade.level === 'lower',
					'--smoke': grenade.smoke,
				}]"
				:style="{ transform: `translate(${grenade.x}px, ${grenade.y}px)` }"
				v-html="grenade.smoke ? null : image(require(`../../img/weapons/${grenade.type}.svg`))"
			/>

			<div
				v-if="bomb.state !== 'carried'"
				:class="[`bomb --${bomb.state}`, { '--lower': bomb.level === 'lower' }]"
				:style="{ transform: `translate(${bomb.x}px, ${bomb.y}px)` }"
				v-html="image(require('../../img/weapons/c4.svg'))"
			/>
		</template>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import radars from '../radars.js'

const grenadeTypes = {
	frag: 'hegrenade',
	smoke: 'smokegrenade',
}

export default {
	data() {
		return {
			imageHeight: null,
		}
	},

	mounted() {
		window.addEventListener('resize', this.onResize)
		this.onResize()
	},

	beforeDestroy() {
		window.removeEventListener('resize', this.onResize)
	},

	methods: {
		offsetX(x) {
			return (Number(x) - this.mapData.pos_x) / this.mapData.scale * (this.imageHeight / 1024)
		},

		offsetY(y) {
			return (Number(y) - this.mapData.pos_y) / -this.mapData.scale * (this.imageHeight / 1024)
		},

		onResize() {
			setTimeout(() => this.imageHeight = this.$refs.image.clientHeight)
		},

		level(z) {
			if (! this.mapData.sections) return 'default'

			for (const level in this.mapData.sections) {
				if (z >= this.mapData.sections[level].min && z <= this.mapData.sections[level].max) return level
			}

			return 'default'
		},

		image(str) {
			return decodeURIComponent(str.replace(/^data:image\/svg\+xml,/, ''))
		},
	},

	computed: {
		...mapGetters({
			allgrenades: 'grenades',
			allplayers: 'allplayers',
			bombRaw: 'bomb',
			focusedPlayer: 'player',
			map: 'map',
		}),

		mapName() {
			return this.map.name.replace(/^.*\//, '')
		},

		mapData() {
			// replace anything like "workshop/<id>/" that's put in front of the map name
			// sure, this doesn't allow for different maps on different versions of the same map, but that should
			// very rarely be a problem in practice
			return radars[this.mapName]
		},

		mapImage() {
			const directory = (this.mapData.simpleradar) ? 'simpleradar' : 'ingame'

			return require(`../../img/minimap/${directory}/${this.mapName}.png`).default
		},

		bomb() {
			if (! this.bombRaw.state) return { state: 'carried' }

			const [x, y, z] = this.bombRaw.position.split(', ')

			return {
				state: this.bombRaw.state,
				x: this.offsetX(x),
				y: this.offsetY(y),
				level: this.level(z),
			}
		},

		grenades() {
			const grenades = []

			for (const id in this.allgrenades) {
				const grenade = this.allgrenades[id]
				if (! grenade || ! (grenade.position || grenade.flames)) continue

				const [x, y, z] = (grenade.position || grenade.flames[Object.keys(grenade.flames).reduce((center, item) =>  center < item ? center : item)]).split(', ')

				grenades.push({
					id,
					smoke: grenade.type === 'smoke' && (grenade.velocity === '0.00, 0.00, 0.00' || grenade.effecttime > 0),
					team: this.allplayers[grenade.owner.numberStr].team.toLowerCase(),
					type: grenadeTypes[grenade.type] || grenade.type,
					x: this.offsetX(x),
					y: this.offsetY(y),
					level: this.level(z),
				})
			}

			return grenades
		},

		players() {
			const players = []

			for (const id in this.allplayers) {
				const player = this.allplayers[id]

				const [x, y, z] = player.position.split(', ')
				let [ax, ay] = player.forward.split(', ')

				let angle = ay

				ax = Math.asin(ax) * 180 / Math.PI
				ay = Math.acos(ay) * 180 / Math.PI

				if (ay < 45) angle = Math.abs(ax)
				else if (ay > 135) angle = 180 - Math.abs(ax)

				if (ax < 0) angle = (angle - 360) * -1

				players.push({
					slot: player.observer_slot,
					team: player.team.toLowerCase(),

					bomb: Object.values(player.weapons).some(({ type }) => type === 'C4'),
					dead: player.state.health === 0,

					x: this.offsetX(x),
					y: this.offsetY(y),
					level: this.level(z),
					angle,
				})
			}

			return players
		},
	},
}
</script>
