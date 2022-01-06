<template>
	<div :class="`player --${direction}`">
		<div v-if="player.state.health" class="health-bar">
			<div :class="`fill --red --${direction}`" :style="{ transform: `scaleX(${delayedHealth / 100})` }"></div>
			<div :class="[`fill --${direction} --${side}`, { '--player-focused': focused }]" :style="{ transform: `scaleX(${player.state.health / 100})` }"></div>
		</div>

		<div :class="['background --top-row', { '--alive': player.state.health, '--player-focused': focused }]"></div>
		<div :class="['background --bottom-row', { '--player-focused': focused }]"></div>

		<div v-if="player.state.health" class="health">
			<div v-for="digit in (player.state.health + '').padStart(3)" class="digit">{{ digit }}</div>
		</div>

		<div v-else class="dead-icon">
			<img src="../../img/elimination.svg">
		</div>

		<div :class="`slot --${direction}`">
			<div class="digit">{{ observerSlot === 10 ? 0 : observerSlot }}</div>
		</div>

		<div class="name">
			{{ player.name }}
		</div>

		<div :class="['round-kills', { '--active': player.state.round_kills }]">
			<img src="../../img/elimination.svg">
			<div class="digit">{{ player.state.round_kills }}</div>
		</div>

		<div class="primary">
			<WeaponIcon :weapon="weapons.primary" />
		</div>

		<div class="equipment">
			<div class="armor">
				<img v-if="armorIcon" :src="require(`../../img/${armorIcon}.svg`)" class="weapon-icon --active">
			</div>

			<div class="bomb">
				<WeaponIcon v-if="player.state.defusekit" :weapon="{ name: 'defuser' }" :active="true" class="--bomb" />
				<WeaponIcon v-else :weapon="weapons.c4" class="--bomb" />
			</div>
		</div>

		<div class="money">
			${{ player.state.money }}
		</div>

		<div :class="['money-spent', { '--active': freezetime }]">
			-${{ moneyAtStartOfRound - player.state.money }}
		</div>

		<div :class="['kills', { '--active': !freezetime }]">
			<div :class="`label --${side}`">K</div>
			<div v-for="digit of (player.match_stats.kills + '').padStart(3)" class="digit">{{ digit }}</div>
		</div>

		<div :class="['deaths', { '--active': !freezetime }]">
			<div :class="`label --${side}`">D</div>
			<div v-for="digit of (player.match_stats.deaths + '').padStart(3)" class="digit">{{ digit }}</div>
		</div>

		<div v-if="player.state.health" class="grenades">
			<WeaponIcon v-for="(grenade, index) in grenades" :key="index" :weapon="grenade" />
		</div>

		<div v-else class="adr">
			<div :class="`label --${side}`">ADR</div>
			<div v-for="digit of (Math.round(adr || 0) + '').padStart(3)" class="digit">{{ digit }}</div>
		</div>

		<div class="secondary">
			<WeaponIcon :weapon="weapons.secondary" />
		</div>

		<div :class="['focused', { '--active': focused }]" />

		<div class="stats-wrapper">
			<div :class="[`stats --${direction}`, { '--active': freezetime }]">
				<div :class="`labels --${side}`">
					<div>K</div>
					<div>A</div>
					<div>D</div>
					<div>ADR</div>
				</div>

				<div class="values">
					<div class="value">
						<div v-for="digit of (player.match_stats.kills + '')" class="digit">{{ digit }}</div>
					</div>

					<div class="value">
						<div v-for="digit of (player.match_stats.assists + '')" class="digit">{{ digit }}</div>
					</div>

					<div class="value">
						<div v-for="digit of (player.match_stats.deaths + '')" class="digit">{{ digit }}</div>
					</div>

					<div class="value">
						<div v-for="digit of (Math.round(adr || 0) + '')" class="digit">{{ digit }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import WeaponIcon from './WeaponIcon'

export default {
	components: {
		WeaponIcon,
	},

	props: [
		'adr',
		'direction',
		'freezetime',
		'observerSlot',
		'player',
		'side',
	],

	data() {
		let hp = 100
		if (this.player && this.player.state) hp = this.player.state.health

		return {
			moneyAtStartOfRound: this.player.state.money,
			delayedHealth: hp,
			delayedHealthTimeout: null,
		}
	},

	computed: {
		...mapGetters({
			focusedPlayer: 'player',
			round: 'round',
		}),

		armorIcon() {
			return (this.player.state.helmet || this.player.state.armor)
				? (this.player.state.helmet ? 'armor' : 'shield')
				: null
		},

		weapons() {
			const weapons = { c4: false, grenades: [] }

			for (const key in this.player.weapons) {
				const weapon = this.player.weapons[key]

				switch (weapon.type) {
					case 'Knife':
						break

					case 'Pistol':
						weapons.secondary = weapon
						break

					case 'Grenade':
						weapons.grenades.push(weapon)
						break

					case 'C4':
						weapons.c4 = weapon
						break

					default:
						weapons.primary = weapon
				}
			}

			return weapons
		},

		secondary() {
			for (const key in this.player.weapons) {
				if (! ['Knife', 'Pistol', 'Grenade', 'C4'].includes(this.player.weapons[key].type)) return this.player.weapons[key]
			}
		},

		grenades() {
			return Object.values(this.weapons.grenades).sort((a, b) => {
				if (a.name !== b.name) return a.name > b.name ? 1 : -1
				return 0
			})
		},

		focused() {
			return this.focusedPlayer && this.focusedPlayer.steamid === this.player.steamid
		},
	},

	watch: {
		player(player, previously) {
			if (player.state.health === previously.state.health) return

			if (this.delayedHealthTimeout) clearTimeout(this.delayedHealthTimeout)

			this.delayedHealthTimeout = setTimeout(() => {
				this.delayedHealth = player.state.health
			}, 2500)
		},

		round(round, previously) {
			if (round && previously && round.phase === previously.phase) return

			if (round.phase === 'freezetime') this.moneyAtStartOfRound = this.player.state.money
		},
	},
}
</script>
