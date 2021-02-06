<template>
	<div v-if="applicable" class="config-window">
		<div class="info-wrapper">
			<div></div>

			<div class="big">
				<div v-for="player in playersAlphabetically.left" :class="`slot --${player.team.toLowerCase()}`">
					{{ player.observer_slot }}
				</div>
			</div>
		</div>

		<div class="minimap-wrapper">
			<Minimap />
		</div>

		<div class="info-wrapper">
			<div>
				<div v-for="player in observerSlots" :class="`slot --${player.team.toLowerCase()}`">
					{{ player.observer_slot }}
					{{ player.name }}
				</div>
			</div>

			<div class="big">
				<div v-for="player in playersAlphabetically.right" :class="`slot --${player.team.toLowerCase()}`">
					{{ player.observer_slot }}
				</div>
			</div>
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
			</div>

			<div class="input-group primary-team">
				<label for="primary-team">
					Name of Team that should be on the left
				</label>
				<input type="text" id="primary-team" v-model="primaryTeam">
			</div>

			<div class="input-group series-event-info">
				<label for="series-name-left">
					Series/Event Info (left side)
				</label>
				<textarea id="series-name-left" v-model="seriesNameLeft" />
			</div>

			<div class="input-group series-event-info">
				<label for="series-name-right">
					Series/Event Info (right side)
				</label>
				<textarea id="series-name-right" v-model="seriesNameRight" />
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
import { mapGetters } from 'vuex'
import Minimap from './Minimap'

export default {
	components: {
		Minimap,
	},

	data() {
		return {
			matches: [{}],
			primaryTeam: 'Das Deutsche Volk',
			seriesNameLeft: null,
			seriesNameRight: null,
		}
	},

	methods: {
		submit() {
			ipcRenderer.send('seriesData', {
				matches: this.matches.filter(({ map }) => map).map((match) => {
					match.scoreLeft = Number(match.scoreLeft)
					match.scoreRight = Number(match.scoreRight)

					return match
				}),
				primaryTeam: this.primaryTeam,
				seriesName: {
					left: this.seriesNameLeft ? (this.seriesNameLeft + '').trim() : null,
					right: this.seriesNameRight ? (this.seriesNameRight + '').trim() : null,
				},
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

		observerSlots() {
			const players = []

			for (const id in this.allplayers) {
				if (this.allplayers[id].observer_slot !== undefined) players.push(this.allplayers[id])
			}

			players.sort(({ observer_slot: a }, { observer_slot: b }) => {
				if (a === 0) return 100
				if (b === 0) return 100

				if (a === b) return 0
				return (a > b) ? 1 : -1
			})

			return players
		},

		playersAlphabetically() {
			const left = []
			const right = []

			for (const id in this.allplayers) {
				if (this.allplayers[id].observer_slot !== undefined) {
					if (this.allplayers[id].team.toLowerCase() === this.directionalSides[0]) left.push(this.allplayers[id])
					else right.push(this.allplayers[id])
				}
			}

			left.sort(({ name: a }, { name: b }) => {
				if (a === b) return 0
				return (a > b) ? 1 : -1
			})

			right.sort(({ name: a }, { name: b }) => {
				if (a === b) return 0
				return (a > b) ? 1 : -1
			})

			return { left, right }
		},
	},
}
</script>
