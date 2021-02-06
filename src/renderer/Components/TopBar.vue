<template>
	<div class="top-bar">
		<template v-for="(team, direction) in { left, right }">
			<div :class="`team-name --${direction} --${directionalSides[Number(direction === 'right')]}`">{{ team.name || (directionalSides[Number(direction === 'right')] === 'ct' ? 'Counter-Terrorists' : 'Terrorists') }}</div>
			<div :class="`round-wins --${direction} --${directionalSides[Number(direction === 'right')]}`">{{ team.score }}</div>

			<div :class="`flag --${direction}`">
				<img v-if="team.flag" :src="`https://flagcdn.com/h120/${team.flag}.png`">
				<img v-else-if="directionalSides[Number(direction === 'right')] === 'ct'" src="../../img/ct.svg">
				<img v-else src="../../img/t.svg">
			</div>

			<div v-if="seriesData.bestOf !== 1" :class="`map-wins --${direction}`">
				<div
					v-for="i in Math.floor(seriesData.bestOf / 2 + 1)"
					:class="[`pip --${directionalSides[Number(direction === 'right')]}`, { '--filled': seriesData.wins[direction] >= i }]"
				/>
			</div>
		</template>

		<div v-if="bomb" :class="['timer-wrapper', {
			'--active': ['planting', 'planted', 'defusing'].includes(bomb.state),
			'--left':  this.directionalSides[0] === 't',
			'--right': this.directionalSides[1] === 't',
		}]">
			<div class="bomb-timer">
				<div class="progress-bar">
					<div
						:class="['fill', { '--planting': bomb.state === 'planting' }]"
						:style="{ transform: `scaleX(${bombTimerScale})` }"
					/>
				</div>
			</div>
		</div>

		<div v-if="bomb" :class="['timer-wrapper', {
			'--active': bomb.state === 'defusing',
			'--left': this.directionalSides[0] === 'ct',
			'--right': this.directionalSides[1] === 'ct',
		}]">
			<div class="defuse-timer">
				<div class="progress-bar">
					<div
						class="fill"
						:style="{ transform: `scaleX(${Math.min(bomb.countdown, defuseDuration) / defuseDuration})` }"
					/>
				</div>
			</div>
		</div>

		<div class="clock">
			<div :class="['time', {
				'--text': ['bomb', 'defuse', 'warmup'].includes(timers.phase),
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
						{{ formattedRoundTimer }}
					</template>
				</template>

				<template v-else-if="map.phase === 'warmup'">
					Warmup
				</template>
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

		<div class="map-no" v-if="seriesData.bestOf !== 1">
			Map
			{{ seriesData.wins.left + seriesData.wins.right + 1 }}
			of
			{{ seriesData.bestOf }}
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import bombsites from '../bombsites.js'

export default {
	props: [
		'directionalSides',
	],

	data() {
		return {
			defuseDuration: 10,
			bombTimerScale: 1,
			bombTimerScaleInterval: null,
		}
	},

	methods: {
		image(str) {
			return decodeURIComponent(str.replace(/^data:image\/svg\+xml,/, ''))
		},
	},

	computed: {
		...mapGetters([
			'allplayers',
			'bomb',
			'map',
			'timers',
			'series',
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

		left() {
			return this.map[`team_${this.directionalSides[0]}`]
		},

		right() {
			return this.map[`team_${this.directionalSides[1]}`]
		},

		formattedRoundTimer() {
			if (! this.timers.phase_ends_in) return

			const time = Math.ceil(this.timers.phase_ends_in)

			if (time < 10) return `0:0${time}`
			if (time < 60) return `0:${time}`
			if (time < 70) return `1:0${time - 60}`
			return `1:${time - 60}`
		},

		seriesData() {
			if (this.series.length < 1) {
				return {
					bestOf: Math.max(this.map.num_matches_to_win_series * 2 - 1, 1),
					wins: {
						left: this.left.matches_won_this_series,
						right: this.right.matches_won_this_series,
					},
				}
			}

			return {
				bestOf: this.series.length,
				wins: {
					left: this.series.reduce((wins, match) => wins + (match.scoreLeft > match.scoreRight), 0),
					right: this.series.reduce((wins, match) => wins + (match.scoreLeft < match.scoreRight), 0),
				},
			}
		},
	},

	watch: {
		bomb(now) {
			if (this.bomb.state === 'planting') {
				this.bombTimerScale = this.bomb.countdown / 3
			} else if (this.bomb.state === 'planted') {
				this.bombTimerScale = this.bomb.countdown / 40

				if (! this.bombTimerScaleInterval) {
					this.bombTimerScaleInterval = setInterval(() => {
						this.bombTimerScale -= .0025 // 1/400, as this interval should trigger 400 times during the 40 second c4timer
					}, 100)
				}
			} else if (this.bomb.state === 'defused') {
				clearInterval(this.bombTimerScaleInterval)
				this.bombTimerScaleInterval = null
			}

			if (now.state === 'defusing' && this.allplayers[now.player.numberStr].state) {
				this.defuseDuration = (this.allplayers[now.player.numberStr].state.defusekit || false) ? 5 : 10
			}
		},

		timers(now) {
			if (this.bombTimerScaleInterval && ['paused', 'timeout_ct', 'timeout_t', 'freezetime'].includes(now.phase)) {
				clearInterval(this.bombTimerScaleInterval)
				this.bombTimerScaleInterval = null
			}
		},
	},
}
</script>
