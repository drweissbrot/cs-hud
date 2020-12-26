<template>
	<div class="sidebars">
		<div
			v-for="(players, direction) in { left, right }"
			:class="[`sidebar --${direction} --${directionalSides[Number(direction === 'right')]}`, {
				'--stats-active': statsActive,
				'--utility-active': utilityActive,
			}]"
		>
			<div v-if="direction === 'left' && seriesName.left" class="wrapper --series-name">
				<div class="series-name" v-text="seriesName.left" />
			</div>

			<div v-if="direction === 'right' && seriesName.right" class="wrapper --series-name">
				<div class="series-name" v-text="seriesName.right" />
			</div>

			<div class="wrapper --utility">
				<div class="utility">
					<div :class="`heading --${directionalSides[Number(direction === 'right')]}`">
						Utility
					</div>

					<div :class="`grenades --${directionalSides[Number(direction === 'right')]}`">
						<div class="grenade">
							<div class="img" v-html="image(require('../../img/weapons/smokegrenade.svg'))" />
							<div class="count">{{ utility[direction].smoke }}</div>
						</div>

						<div class="grenade">
							<div
								class="img"
								v-html="image(require(`../../img/weapons/${
									(directionalSides[Number(direction === 'right')] === 'ct')
										? 'incgrenade'
										: 'molotov'
								}.svg`))"
							/>
							<div class="count">{{ utility[direction].molotov }}</div>
						</div>

						<div class="grenade">
							<div class="img" v-html="image(require('../../img/weapons/flashbang.svg'))" />
							<div class="count">{{ utility[direction].flash }}</div>
						</div>

						<div class="grenade">
							<div class="img" v-html="image(require('../../img/weapons/hegrenade.svg'))" />
							<div class="count">{{ utility[direction].he }}</div>
						</div>
					</div>
				</div>
			</div>

			<div class="wrapper">
				<div class="economy">
					<div class="loss-bonus-pips">
						<div v-for="i in 4" :class="[`pip --${directionalSides[Number(direction === 'right')]}`, { '--filled': lossBonus[direction] >= (5 - i) }]" />
					</div>

					<div class="loss-bonus">
						<div :class="`label --${directionalSides[Number(direction === 'right')]}`">Loss Bonus</div>
						<div class="number">
							${{ 1400 + lossBonus[direction] * 500 }}
						</div>
					</div>

					<div class="equipment-value">
						<div :class="`label --${directionalSides[Number(direction === 'right')]}`">
							Equipment Value
						</div>
						<div class="number">
							${{ equipmentValue[direction] }}
						</div>
					</div>
				</div>
			</div>

			<SidebarPlayer
				v-for="player in players"
				:key="player.observer_slot"
				:adr="adr[player.steamid]"
				:player="player"
				:side="directionalSides[Number(direction === 'right')]"
			/>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarPlayer from './SidebarPlayer'
import WeaponIcon from './WeaponIcon'

export default {
	components: {
		SidebarPlayer,
		WeaponIcon,
	},

	props: [
		'adr',
		'directionalSides',
	],

	data() {
		return {
			// statsActive: true,
			// utilityActive: true,
			statsActive: false, // TODO this line is right
			utilityActive: false, // TODO this line is right
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
			'map',
			'timers',
			'seriesName',
		]),

		players() {
			const players = []

			for (const id in this.allplayers) {
				this.allplayers[id].steamid = id
				players.push(this.allplayers[id])
			}

			return players.sort(({ observer_slot: a }, { observer_slot: b }) => {
				if (a === 0) a = 100
				if (b === 0) b = 100

				if (a === b) return 0
				return (a > b) ? 1 : -1
			})
		},

		left() {
			const team = this.directionalSides[0].toUpperCase()
			return this.players.filter((player) => player.team === team)
		},

		right() {
			const team = this.directionalSides[1].toUpperCase()
			return this.players.filter((player) => player.team === team)
		},

		equipmentValue() {
			return {
				left: this.left.reduce((sum, player) => sum + player.state.equip_value, 0),
				right: this.right.reduce((sum, player) => sum + player.state.equip_value, 0),
			}
		},

		lossBonus() {
			return {
				left: this.map[`team_${this.directionalSides[0]}`].consecutive_round_losses,
				right: this.map[`team_${this.directionalSides[1]}`].consecutive_round_losses,
			}
		},

		utility() {
			const utility = {
				left: { smoke: 0, molotov: 0, flash: 0, he: 0 },
				right: { smoke: 0, molotov: 0, flash: 0, he: 0 },
			}

			for (const direction in utility) {
				const grenades = utility[direction]

				for (const player of this[direction]) {
					for (const weapon in player.weapons) {
						const { name } = player.weapons[weapon]

						if (name === 'weapon_smokegrenade') grenades.smoke++
						else if (name === 'weapon_molotov' || name === 'weapon_incgrenade') grenades.molotov++
						else if (name === 'weapon_flashbang') grenades.flash++
						else if (name === 'weapon_hegrenade') grenades.he++
					}
				}
			}

			return utility
		},
	},

	watch: {
		timers(timers, previously) {
			if (timers.phase === previously.phase) return

			if (timers.phase === 'live') {
				this.timeout = setTimeout(() => {
					this.statsActive = false

					this.timeout = setTimeout(() => this.utilityActive = false, 2500)
				}, 3500)
			} else if (timers.phase === 'bomb') {
				clearTimeout(this.timeout)
				this.statsActive = false
				this.utilityActive = true

				this.timeout = setTimeout(() => this.utilityActive = false, 7500)
			} else if (['freezetime', 'paused', 'timeout_ct', 'timeout_t'].includes(timers.phase)) {
				clearTimeout(this.timeout)
				this.statsActive = true
				this.utilityActive = true
			}
		},
	},
}
</script>
