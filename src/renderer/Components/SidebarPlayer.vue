<template>
	<div :class="['player', { '--focused': focusedPlayer && focusedPlayer.steamid === player.steamid }]">
		<div v-if="player.state.health > 0" class="life">
			<div class="health-bar">
				<div :class="`fill --${side}`" :style="{ transform: `scaleX(${player.state.health / 100})` }"></div>
			</div>

			<div class="hp">
				<span>{{ player.state.health }}</span>
			</div>

			<div class="slot">{{ observerSlot === 10 ? 0 : observerSlot }}</div>
			<div class="name">{{ player.name }}</div>

			<div v-if="player.state.round_kills > 0" class="round-kills">
				<img src="../../img/elimination.svg">
				<div class="number">{{ player.state.round_kills }}</div>
			</div>

			<div class="primary">
				<WeaponIcon :weapon="weapons.primary" />
			</div>

			<div class="armor-bomb">
				<img
					v-if="armorIcon"
					:src="require(`../../img/${armorIcon}.svg`)"
					class="weapon-icon --active --armor"
				>

				<WeaponIcon :weapon="weapons.c4" />
				<WeaponIcon v-if="player.state.defusekit" :weapon="{ name: 'defuser' }" :active="true" />
			</div>

			<div class="money">${{ player.state.money }}</div>

			<div class="grenades">
				<WeaponIcon v-for="(grenade, index) in weapons.grenades" :key="index" :weapon="grenade" />
			</div>

			<div class="secondary">
				<WeaponIcon :weapon="weapons.secondary" />
			</div>
		</div>

		<div v-else class="life --dead">
			<img class="dead-icon" src="../../img/elimination.svg">

			<div class="slot">{{ observerSlot === 10 ? 0 : observerSlot }}</div>
			<div class="name">{{ player.name }}</div>

			<div v-if="player.state.round_kills > 0" class="round-kills">
				<img src="../../img/elimination.svg">
				<div class="number">{{ player.state.round_kills }}</div>
			</div>

			<div class="money">${{ player.state.money }}</div>

			<div class="primary">
				<div class="label --kills">K</div>
				<div class="label --assists">A</div>
				<div class="label --deaths">D</div>
				<div class="label --adr">ADR</div>
			</div>

			<div class="secondary">
				<div class="number --kills">{{ player.match_stats.kills }}</div>
				<div class="number --assists">{{ player.match_stats.assists }}</div>
				<div class="number --deaths">{{ player.match_stats.deaths }}</div>
				<div class="number --adr">{{ Math.round(adr || 0) }}</div>
			</div>
		</div>

		<div class="focused" />

		<div class="stats">
			<div class="inner">
				<div :class="`label --kills --${side}`">K</div>
				<div :class="`label --assists --${side}`">A</div>
				<div :class="`label --deaths --${side}`">D</div>
				<div :class="`label --adr --${side}`">ADR</div>

				<div class="number --kills">{{ player.match_stats.kills }}</div>
				<div class="number --assists">{{ player.match_stats.assists }}</div>
				<div class="number --deaths">{{ player.match_stats.deaths }}</div>
				<div class="number --adr">{{ Math.round(adr || 0) }}</div>

				<div class="purchases">
					-${{ moneyAtStartOfRound - player.state.money }}
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
		'observerSlot',
		'player',
		'side',
	],

	data() {
		return {
			moneyAtStartOfRound: this.player.state.money,
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
	},

	watch: {
		round(round, previously) {
			if (round && previously && round.phase === previously.phase) return

			if (round.phase === 'freezetime') this.moneyAtStartOfRound = this.player.state.money
		},
	},
}
</script>
