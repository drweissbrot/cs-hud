<template>
	<div :class="['focused-player', { '--active': active }]">
		<div :class="`life --${side}`">
			<div class="inner">
				<div class="health">
					<img src="../../img/health.svg">

					<div class="number">
						<div v-for="digit in ((player.state.health + '') || '').padStart(3)" class="digit">
							{{ digit }}
						</div>
					</div>
				</div>

				<div class="armor">
					<img v-if="player.state.helmet" src="../../img/armor.svg">
					<img v-else src="../../img/shield.svg">

					<div class="number">
						<div v-for="digit in ((player.state.armor + '') || '').padStart(3)" class="digit">
							{{ digit }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="center">
			<div class="first-row">
				<div class="diagonal-wrapper --left">
					<div :class="`diagonal --${side}`"></div>
				</div>

				<div class="inner">
					<div class="flag-wrapper">
						<div
							:class="`flag --${side} ${flagStyle(team.flag)}`"
							:style="{ backgroundImage: team.flag && `url('https://flagcdn.com/${team.flag.toLowerCase()}.svg')` }"
						></div>
					</div>

					<div class="inner">
						<img v-if="team.flag" class="flag-icon" :src="`https://flagcdn.com/${team.flag.toLowerCase()}.svg`">
						<img v-else-if="side === 'ct'" src="../../img/ct.svg" class="flag-icon">
						<img v-else src="../../img/t.svg" class="flag-icon">

						<div class="player-name">
							{{ player.name }}
						</div>

						<div v-if="player.state.round_kills" class="round-kills">
							<div :class="`icon --${side}`" v-html="image(require('../../img/elimination.svg'))" />
							<div class="digit">{{ player.state.round_kills }}</div>
						</div>
					</div>
				</div>

				<div class="diagonal-wrapper --right">
					<div :class="`diagonal --${side}`"></div>
				</div>
			</div>

			<div class="second-row">
				<div class="diagonal-wrapper --left">
					<div :class="`diagonal --${side}`"></div>
				</div>

				<div class="inner">
					<div :class="`stats --${side}`">
						<div class="stat">
							<div class="label">K</div>
							<div class="number">{{ player.match_stats.kills }}</div>
						</div>

						<div class="stat">
							<div class="label">A</div>
							<div class="number">{{ player.match_stats.assists }}</div>
						</div>

						<div class="stat">
							<div class="label">D</div>
							<div class="number">{{ player.match_stats.deaths }}</div>
						</div>

						<div class="stat">
							<div class="label">ADR</div>
							<div class="number">{{ Math.round((adr[player.steamid] || 0)) }}</div>
						</div>
					</div>

					<div class="utility">
						<div class="bomb">
							<img v-if="player.state.defusekit" src="../../img/weapons/defuser.svg">
							<img v-else-if="carryingBomb" src="../../img/weapons/c4.svg">
						</div>

						<div class="grenades">
							<img
								v-for="[grenade, active] in grenades"
								:src="require(`../../img/weapons/${grenade}.svg`)"
								:class="['grenade', { '--active' : active }]"
							>
						</div>
					</div>
				</div>

				<div class="diagonal-wrapper --right">
					<div :class="`diagonal --${side}`"></div>
				</div>
			</div>
		</div>

		<div :class="[`ammo --${side}`, { '--active': activeWeapon && !['Grenade', 'Knife', 'C4'].includes(activeWeapon.type) }]">
			<div class="inner">
				<div class="current">
					<div class="number">
						<div
							v-for="digit in (activeWeapon && activeWeapon.ammo_clip + '' || '').padStart(3)"
							:class="{ 'digit': !isNaN(digit) }"
						>
							{{ digit }}
						</div>
					</div>
				</div>

				<div class="reserve-wrapper">
					<div class="reserve">
						<div class="number">
							<div>/</div>
							<div
								v-for="digit in (activeWeapon && activeWeapon.ammo_reserve + '' || '')"
								:class="{ 'digit': !isNaN(digit) }"
							>
								{{ digit }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import flagStyle from '../flag-style'

export default {
	props: [
		'adr',
	],

	data() {
		return {
			player: { match_stats: {}, state: {} },
		}
	},

	computed: {
		...mapGetters({
			focusedPlayer: 'player',
			map: 'map',
			timers: 'timers',
		}),

		activeWeapon() {
			for (const key in this.player.weapons) {
				if (this.player.weapons[key].state === 'active') return this.player.weapons[key]
			}
		},

		grenades() {
			const grenades = []

			for (const key in this.player.weapons) {
				const { ammo_reserve, type, name, state } = this.player.weapons[key]

				if (type === 'Grenade') {
					for (let i = 0; i < ammo_reserve; i++) {
						grenades.push([name.replace(/^weapon_/, ''), state === 'active'])
					}
				}
			}

			return grenades.sort((a, b) => {
				if (a[0] !== b[0]) return a[0] > b[0] ? 1 : -1
				return 0
			})
		},

		side() {
			return (this.player.team || 'ct').toLowerCase()
		},

		team() {
			return this.map[`team_${this.side}`]
		},

		carryingBomb() {
			for (const key in this.player.weapons) {
				if (this.player.weapons[key].type === 'C4') return true
			}

			return false
		},

		active() {
			return this.map.phase !== 'intermission'
				&& !['paused', 'timeout_ct', 'timeout_t', 'freezetime'].includes(this.timers.phase)
				&& this.focusedPlayer
				&& this.focusedPlayer.spectarget
				&& this.focusedPlayer.spectarget !== 'free'
		},
	},

	methods: {
		flagStyle,

		image(str) {
			return decodeURIComponent(str.replace(/^data:image\/svg\+xml,/, ''))
		},
	},

	watch: {
		focusedPlayer(focusedPlayer) {
			if (focusedPlayer.spectarget && focusedPlayer.spectarget !== 'free') this.player = focusedPlayer
		},
	},
}
</script>
