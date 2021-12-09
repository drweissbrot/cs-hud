<template>
	<div v-if="applicable" class="config-window">
		<header>
			<h1>CS:GO HUD Config</h1>

			<nav>
				<ul>
					<li>
						<button
							type="button"
							:class="{ active: activeTab === 'preferences' }"
							@click="activeTab = 'preferences'"
							title="Preferences – Alt+1"
						>
							Preferences
						</button>
					</li>

					<li>
						<button
							type="button"
							:class="{ active: activeTab === 'series' }"
							@click="activeTab = 'series'"
							title="Series – Alt+2"
						>
							Series
						</button>
					</li>

					<li>
						<button
							type="button"
							:class="{ active: activeTab === 'matches' }"
							@click="activeTab = 'matches'"
							title="Matches – Alt+3"
						>
							Matches
						</button>
					</li>

					<li>
						<button
							type="button"
							:class="{ active: activeTab === 'minimap' }"
							@click="activeTab = 'minimap'"
							title="Minimap – Alt+4"
						>
							Minimap
						</button>
					</li>
				</ul>
			</nav>

			<button @click.prevent="submit" :class="{ green: highlightSaveButton }" title="Ctrl+S">
				Save
			</button>
		</header>

		<section v-if="activeTab === 'preferences'">
			<div class="input-group">
				<label>
					<input type="checkbox" v-model="observerSlotSortingEnabled">
					Sort observer slots
				</label>
			</div>

			<div class="input-group">
				<label>
					<input type="checkbox" v-model="enableAutoHotKeyMapping">
					Enable AutoHotKey observer slot remapping (this setting is not persisted across HUD restarts)
				</label>
			</div>

			<div class="input-group">
				<label>
					<input type="checkbox" v-model="prePostMatchAnimationsEnabled">
					Enable Pre and Post Match Animations
				</label>
			</div>

			<div class="input-group">
				<label>
					<input type="checkbox" v-model="autoplayPostMatchAnimations">
					Start Post Match Outro and Post Series Outro automatically on match end
				</label>
			</div>

			<div class="input-group">
				<label for="animations-generic-background-video">Pre/Post Match Animations Background Video</label>

				<button id="animations-generic-background-video" class="choose-file" @click.prevent="selectAnimationsGenericBackgroundVideo">Choose File...</button>
				<label class="inline" for="animations-generic-background-video">{{ animationsGenericBackgroundVideoPath || 'Not selected' }}</label>
			</div>

			<div class="input-group">
				<label for="pre-match-intro-music">Pre Match Intro Music</label>

				<button id="pre-match-intro-music" class="choose-file" @click.prevent="selectPreMatchIntroMusic">Choose File...</button>
				<label class="inline" for="pre-match-intro-music">{{ preMatchIntroMusicPath || 'Not selected' }}</label>
			</div>

			<div class="input-group">
				<label for="post-match-outro-music">Post Match Outro Music</label>

				<button id="post-match-outro-music" class="choose-file" @click.prevent="selectPostMatchOutroMusic">Choose File...</button>
				<label class="inline" for="post-match-outro-music">{{ postMatchOutroMusicPath || 'Not selected' }}</label>
			</div>
		</section>

		<section v-else-if="activeTab === 'series'">
			<div class="input-group primary-team">
				<label for="primary-team">
					Name of Team that should be on the left (otherwise, CT will be on the left)
				</label>
				<input type="text" id="primary-team" v-model="primaryTeam">
			</div>

			<div class="input-group series-event-info">
				<label for="series-name">
					Series/Event Info (either 1 or 3 lines; leave empty to hide)
				</label>
				<textarea id="series-name" v-model="seriesName" />
			</div>

			<div class="input-group">
				<label for="series-number">
					Series Number (only used for Pre Match Intro and Post Match Outro)
				</label>
				<input id="series-number" type="text" v-model="seriesNumber">
			</div>
		</section>

		<section v-else-if="activeTab === 'matches'">
			<button @click.prevent="matches.push({})">
				Add Match
			</button>

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
		</section>

		<section v-else-if="activeTab === 'minimap'" class="minimap-wrapper">
			<Minimap :directionalSides="enableAutoHotKeyMapping ? directionalSides : null" />
		</section>
	</div>
</template>

<script>
import * as fs from 'fs'
import { execFile as run } from 'child_process'
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'
import Minimap from './Minimap'

export default {
	components: {
		Minimap,
	},

	data() {
		return {
			activeTab: 'preferences',
			highlightSaveButton: false,

			animationsGenericBackgroundVideoPath: this.$store.getters.animationsGenericBackgroundVideoPath, // TODO add in vuex
			autoplayPostMatchAnimations: this.$store.getters.autoplayPostMatchAnimations,
			matches: (this.$store.getters.series?.length ? this.$store.getters.series : [{}]) || [{}],
			observerSlotSortingEnabled: this.$store.getters.observerSlotSortingEnabled,
			postMatchOutroMusicPath: this.$store.getters.postMatchOutroMusicPath, // TODO add in vuex
			preMatchIntroMusicPath: this.$store.getters.preMatchIntroMusicPath, // TODO add in vuex
			prePostMatchAnimationsEnabled: this.$store.getters.prePostMatchAnimationsEnabled,
			primaryTeam: this.$store.getters.primaryTeam,
			seriesName: this.$store.getters.seriesName.join('\n'),
			seriesNumber: this.$store.getters.seriesNumber,

			autoHotKeyPlayerSlotMapping: null,
			autoHotKeyProcess: null,
			enableAutoHotKeyMapping: false,
		}
	},

	mounted() {
		document.addEventListener('keyup', (e) => {
			if (e.key === 's' && e.ctrlKey && !e.shiftKey && !e.altKey) {
				e.preventDefault()
				return this.submit()
			}

			if (e.altKey && !e.ctrlKey && !e.shiftKey) {
				if (e.key === '1') return this.activeTab = 'preferences'
				if (e.key === '2') return this.activeTab = 'series'
				if (e.key === '3') return this.activeTab = 'matches'
				if (e.key === '4') return this.activeTab = 'minimap'
			}
		})
	},

	methods: {
		submit() {
			ipcRenderer.send('config', {
				animationsGenericBackgroundVideoPath: this.animationsGenericBackgroundVideoPath,
				autoplayPostMatchAnimations: this.autoplayPostMatchAnimations,
				observerSlotSortingEnabled: this.observerSlotSortingEnabled,
				postMatchOutroMusicPath: this.postMatchOutroMusicPath,
				preMatchIntroMusicPath: this.preMatchIntroMusicPath,
				prePostMatchAnimationsEnabled: this.prePostMatchAnimationsEnabled,
				primaryTeam: this.primaryTeam,
				seriesName: this.seriesName ? (this.seriesName + '').trim().split('\n').filter((str) => str) : null,
				seriesNumber: this.seriesNumber,

				matches: this.matches.filter(({ map }) => map).map((match) => {
					match.scoreLeft = Number(match.scoreLeft)
					match.scoreRight = Number(match.scoreRight)

					return match
				}),
			})

			this.highlightSaveButton = true
			setTimeout(() => this.highlightSaveButton = false, 500)
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

		showOpenFileDialog(title, filters, callback) {
			const id = Math.random()

			ipcRenderer.send('showOpenFileDialog', {
				id,
				options: {
					filters,
					title,
					properties: ['dontAddToRecent', 'openFile'],
				},
			})

			ipcRenderer.on('openFileDialogResponse', (event, message) => {
				if (message.id !== id) return
				callback(message.response)
			})
		},

		selectAnimationsGenericBackgroundVideo() {
			this.showOpenFileDialog('Select Background Video for Pre/Post Match Animations', [
				{ name: 'Videos', extensions: ['mp4', 'ogg', 'webm', 'mov'] },
				{ name: 'All Files', extensions: ['*'] },
			], (response) => {
				this.animationsGenericBackgroundVideoPath = response.filePaths[0] || null
				this.submit()
			})
		},

		selectPreMatchIntroMusic() {
			this.showOpenFileDialog('Select Pre Match Intro Music', [
				{ name: 'Audio', extensions: ['flac', 'mp3', 'ogg', 'opus', 'vorbis', 'aac'] },
				{ name: 'All Files', extensions: ['*'] },
			], (response) => {
				this.preMatchIntroMusicPath = response.filePaths[0] || null
				this.submit()
			})
		},

		selectPostMatchOutroMusic() {
			this.showOpenFileDialog('Select Post Match Outro Music', [
				{ name: 'Audio', extensions: ['flac', 'mp3', 'ogg', 'opus', 'vorbis', 'aac'] },
				{ name: 'All Files', extensions: ['*'] },
			], (response) => {
				this.postMatchOutroMusicPath = response.filePaths[0] || null
				this.submit()
			})
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
