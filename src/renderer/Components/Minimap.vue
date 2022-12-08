<template>
	<div v-if="map && map.name" :class="['minimap', {
		'--transparent': mapData.transparent,
		'--series-name-active': seriesName && (seriesName.length === 1 || seriesName.length === 3),
	}]">
		<img ref="image" :src="mapImage" @load="onResize">

		<template v-if="imageHeight !== null">
			<div
				v-for="player in players" :key="player.id"
				:class="[`player-dot --${player.team}`, {
					'--bomb': player.bomb,
					'--dead': player.dead,
					'--focused': focusedPlayer && focusedPlayer.steamid === player.id,
					'--lower': player.level === 'lower',
				}]"
				:style="{ transform: `translate(${player.x}px, ${player.y}px)` }"
			>
				<template v-if="! player.dead">
					<template v-if="! directionalSides">
						{{ player.slot }}
					</template>

					<template v-else-if="directionalSides[0] === player.team">
						{{ player.slot + 1 }}
					</template>

					<template v-else>
						{{ player.slot + 6 === 10 ? 0 : player.slot + 6 }}
					</template>

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
	props: [
		'directionalSides',
	],

	data() {
		return {
			imageHeight: null,
			previousPlayerAngles: {},
			previousPlayerPositions: {},
			previousGrenadePositions: {},
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
			return Math.round((Number(x) - this.mapData.pos_x) / this.mapData.scale * (this.imageHeight / 1024))
		},

		offsetY(y) {
			return Math.round((Number(y) - this.mapData.pos_y) / -this.mapData.scale * (this.imageHeight / 1024))
		},

		onResize() {
			setTimeout(() => {
				if (this.$refs.image) this.imageHeight = this.$refs.image.clientHeight
			})
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
			seriesName: 'seriesName',
			timers: 'timers',
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
			if (! this.bombRaw || ! this.bombRaw.state) return { state: 'carried' }

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

				if (! this.previousGrenadePositions.hasOwnProperty(id)) this.previousGrenadePositions[id] = []

				let [x, y, z] = (grenade.position || grenade.flames[Object.keys(grenade.flames).reduce((center, item) => center < item ? center : item)]).split(', ')

				x = this.offsetX(x)
				y = this.offsetY(y)

				if (this.previousGrenadePositions[id].length > 3) this.previousGrenadePositions[id].shift()
				this.previousGrenadePositions[id].push([x, y])

				;[x, y] = this.previousGrenadePositions[id].reduce(([cx, cy], [x, y]) => [cx + x, cy + y], [0, 0])

				grenades.push({
					id,
					smoke: grenade.type === 'smoke' && (grenade.velocity === '0.00, 0.00, 0.00' || grenade.effecttime > 0),
					team: (this.allplayers[grenade.owner] || { team: 'ct' }).team.toLowerCase(),
					type: grenadeTypes[grenade.type] || grenade.type,
					x: x / this.previousGrenadePositions[id].length,
					y: y / this.previousGrenadePositions[id].length,
					level: this.level(z),
				})
			}

			// the game reuses entity ids of grenades a lot -- clear our position data of any now unused grenades to
			// prevent issues when averaging out positions
			const existingIds = Object.keys(this.allgrenades || {})

			for (const id in this.previousGrenadePositions) {
				if (!existingIds.includes(id)) delete this.previousGrenadePositions[id]
			}

			return grenades
		},

		players() {
			const players = []

			for (const id in this.allplayers) {
				const player = this.allplayers[id]

				if (! this.previousPlayerPositions.hasOwnProperty(id)) this.previousPlayerPositions[id] = []

				let [x, y, z] = player.position.split(', ')

				x = this.offsetX(x)
				y = this.offsetY(y)

				const [ax, ay] = player.forward.split(', ')
				let angle = (parseFloat(ax) > 0)
					? 90 + parseFloat(ay) * -90
					: 270 + parseFloat(ay) * 90

				if (angle > 270 && this.previousPlayerAngles[id] < 90) {
					for (const pos of this.previousPlayerPositions[id]) pos[2] += 360
				} else if (angle < 90 && this.previousPlayerAngles[id] > 270) {
					for (const pos of this.previousPlayerPositions[id]) pos[2] -= 360
				}

				if (this.previousPlayerPositions[id].length > 7) this.previousPlayerPositions[id].shift()
				this.previousPlayerPositions[id].push([x, y, angle])

				;[x, y, angle] = this.previousPlayerPositions[id].reduce(([cx, cy, ca], [x, y, a]) => {
					return [cx + x, cy + y, ca + a]
				}, [0, 0, 0])

				angle = this.previousPlayerAngles[id] = angle / this.previousPlayerPositions[id].length

				players.push({
					id,
					name: player.name,
					slot: player.observer_slot,
					team: player.team.toLowerCase(),

					bomb: Object.values(player.weapons).some(({ type }) => type === 'C4'),
					dead: player.state.health === 0,

					x: x / this.previousPlayerPositions[id].length,
					y: y / this.previousPlayerPositions[id].length,
					level: this.level(z),
					angle,
				})
			}

			if (this.directionalSides) {
				players.sort(({ name: a }, { name: b }) => {
					a = a.toLowerCase()
					b = b.toLowerCase()

					if (a === b) return 0
					return (a > b) ? 1 : -1
				})

				let ct = 0
				let t = 0

				for (const player of players) {
					if (player.team === 'ct') player.slot = ct++
					else if (player.team === 't') player.slot = t++
				}
			}

			return players
		},
	},

	watch: {
		timers(now, previous) {
			if (previous.phase === 'over' && now.phase === 'freezetime') {
				this.previousPlayerAngles = {}
				this.previousPlayerPositions = {}
				this.previousGrenadePositions = {}
			}
		},
	},
}
</script>
