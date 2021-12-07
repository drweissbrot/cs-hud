<template>
	<div v-if="applicable" :class="['config-window', { '--mirrored': mirrored }]">
		<div class="minimap-wrapper">
			<Minimap :directionalSides="enableAutoHotKeyMapping ? directionalSides : null" />
		</div>

		<div class="config">
			<h1>CS:GO HUD Series Data</h1>

			<div class="buttons">
				<button @click.prevent="matches.push({})">
					Add Match
				</button>

				<button @click.prevent="submit">
					Save
				</button>

				<button @click.prevent="mirrored = ! mirrored">
					Mirror Config Window
				</button>
			</div>

			<div class="input-group">
				<label>
					<input type="checkbox" v-model="enableAutoHotKeyMapping">
					Enable AutoHotKey observer slot remapping
				</label>
			</div>

			<div class="input-group primary-team">
				<label for="primary-team">
					Name of Team that should be on the left
				</label>
				<input type="text" id="primary-team" v-model="primaryTeam">
			</div>

			<div class="input-group series-event-info">
				<label for="series-name">
					Series/Event Info (either 1 or 3 lines)
				</label>
				<textarea id="series-name" v-model="seriesName" />
			</div>

			<div class="input-group">
				<label for="series-number">
					Series Number (for Pre Match Intro and Post Match Outro)
				</label>
				<input id="series-number" type="text" v-model="seriesNumber">
			</div>

			<div class="match" v-for="(match, i) in matches">
				<div class="number centered">
					#{{ i + 1 }}
				</div>

				<div class="input-group">
					<label :for="`map-${i}`">Map</label>
					<input type="text" :id="`map-${i}`" v-model="matches[i].map" required>
				</div>

				<div class="input-group">
					<label>Picked by</label>
					<label :for="`picked-${i}-left`" class="inline">left</label>
					<input type="radio" :id="`picked-${i}-left`" value="0" v-model="matches[i].picked">
					<input type="radio" :id="`picked-${i}-right`" value="1" v-model="matches[i].picked">
					<label :for="`picked-${i}-right`" class="inline">right</label>

					<div>
						<input type="radio" :id="`picked-${i}-neither`" :value="null" v-model="matches[i].picked">
						<label :for="`picked-${i}-neither`" class="inline">neither</label>
					</div>
				</div>

				<div class="input-group">
					<label :for="`score-left-${i}`">Score</label>
					<input type="number" :id="`score-left-${i}`" min="0" v-model="matches[i].scoreLeft">

					<label class="inline" :for="`score-right-${i}`">:</label>
					<input type="number" :id="`score-right-${i}`" min="0" v-model="matches[i].scoreRight">
				</div>

				<div class="input-group centered">
					<input type="checkbox" :id="`currently-playing-${i}`" v-model="matches[i].currentlyPlaying">
					<label :for="`currently-playing-${i}`" class="inline">
						Currently Playing
					</label>
				</div>

				<div class="input-group centered">
					<button @click.prevent="matches.splice(i, 1)">
						Remove Match
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ipcRenderer } from 'electron'
import * as fs from 'fs'
import { execFile as run } from 'child_process'
import { mapGetters } from 'vuex'
import Minimap from './Minimap'

export default {
	components: {
		Minimap,
	},

	data() {
		return {
			matches: (this.$store.getters.series?.length ? this.$store.getters.series : [{}]) || [{}],
			primaryTeam: this.$store.getters.primaryTeam,
			seriesName: this.$store.getters.seriesName.join('\n'),
			seriesNumber: this.$store.getters.seriesNumber,

			enableAutoHotKeyMapping: false,
			autoHotKeyPlayerSlotMapping: null,
			autoHotKeyProcess: null,
			mirrored: false,
		}
	},

	methods: {
		submit() {
			ipcRenderer.send('seriesData', {
				primaryTeam: this.primaryTeam,
				seriesName: this.seriesName ? (this.seriesName + '').trim().split('\n').filter((str) => str) : null,
				seriesNumber: this.seriesNumber,

				matches: this.matches.filter(({ map }) => map).map((match) => {
					match.scoreLeft = Number(match.scoreLeft)
					match.scoreRight = Number(match.scoreRight)

					return match
				}),
			})
		},

		restartAutoHotKeyIfRequired() {
			if (! this.enableAutoHotKeyMapping || ! this.allplayers) return this.stopAutoHotKeyMapping()

			const players = Object.values(this.allplayers).sort(({ name: a }, { name: b }) => {
				a = a.toLowerCase()
				b = b.toLowerCase()

				if (a === b) return 0
				return (a > b) ? 1 : -1
			})

			const ct = players.filter(({ team }) => team.toLowerCase() === 'ct')
			const t = players.filter(({ team }) => team.toLowerCase() === 't')

			const sides = (this.directionalSides[0] === 'ct')
				? [ct, t]
				: [t, ct]

			const mapping = []

			for (const side of sides) {
				for (const player of side) {
					mapping.push(player.observer_slot)
				}
			}

			const json = JSON.stringify(mapping)

			if (json === this.autoHotKeyPlayerSlotMapping) return

			this.autoHotKeyPlayerSlotMapping = json

			const remappedKeys = ['1yz', '2u', '3i', '4o', '5p', '6', '7', '8', '9', '0']
			fs.writeFileSync('player_slot_mapping.ahk', '#NoEnv\nSendMode Input\n' + mapping.map((slot) => {
				return remappedKeys.shift().split('').map((key) => `${key}::${slot}`).join('\n')
			}).join('\n'))

			this.autoHotKeyProcess = run('C:\\Program Files\\AutoHotKey\\AutoHotKey.exe', ['/r', '/ErrorStdOut', 'player_slot_mapping.ahk'])
		},

		stopAutoHotKeyMapping() {
			this.autoHotKeyPlayerSlotMapping = null

			if (! this.autoHotKeyProcess) return

			this.autoHotKeyProcess.kill()
			this.autoHotKeyProcess = null
		},
	},

	computed: {
		...mapGetters([
			'allplayers',
			'map',
		]),

		applicable() {
			return window.location.hash === '#config'
		},

		directionalSides() {
			if (! this.map) return ['ct', 't']

			if (this.map.team_ct.name === this.primaryTeam) return ['ct', 't']
			if (this.map.team_t.name === this.primaryTeam) return ['t', 'ct']
			if (this.map.team_ct.flag === 'de') return ['ct', 't']
			if (this.map.team_t.flag === 'de') return ['t', 'ct']

			return ['ct', 't']
		},
	},

	watch: {
		allplayers(allplayers) {
			if (this.enableAutoHotKeyMapping) this.restartAutoHotKeyIfRequired()
		},

		enableAutoHotKeyMapping(enabled) {
			(enabled)
				? this.restartAutoHotKeyIfRequired()
				: this.stopAutoHotKeyMapping()
		},
	},
}
</script>
