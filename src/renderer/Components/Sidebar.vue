<template>
	<div :class="`sidebar --${direction} --${side}`">
		<div class="economy-wrapper">
			<div :class="[`economy --${direction} --${side}`, { '--active': freezetime }]">
				<div class="loss-bonus">
					<div class="heading">Loss Bonus</div>

					<div :class="`pips-and-value --${direction}`">
						<div class="loss-bonus-pips">
							<div v-for="i in 4" :class="['pip', { '--filled': lossBonusLevel >= (5 - i) }]" />
						</div>

						<div class="value">
							${{ 1400 + lossBonusLevel * 500 }}
						</div>
					</div>
				</div>

				<div class="team-money">
					<div class="heading">Team Money</div>

					<div class="value">
						${{ teamMoney }}
					</div>
				</div>

				<div class="equipment-value">
					<div class="heading">Equip Value</div>

					<div class="value">
						${{ equipmentValue }}
					</div>
				</div>
			</div>
		</div>

		<div :class="[`utility --${direction} --${side}`, { '--show-total-label': freezetime }]">
			<div :class="`total --${side}`">
				<div class="number">
					{{ grenadeTotal }}
				</div>

				<div class="label-wrapper">
					<div class="label">&nbsp;total&nbsp;</div>
				</div>
			</div>

			<div class="grenade">
				<div class="img" v-html="image(require('../../img/weapons/smokegrenade.svg'))" />
				<div class="count">{{ grenades.smoke }}</div>
			</div>

			<div class="grenade">
				<div
					class="img"
					v-html="image(require(`../../img/weapons/${
						(side === 'ct') ? 'incgrenade' : 'molotov'
					}.svg`))"
				/>
				<div class="count">{{ grenades.molotov }}</div>
			</div>

			<div class="grenade">
				<div class="img" v-html="image(require('../../img/weapons/flashbang.svg'))" />
				<div class="count">{{ grenades.flash }}</div>
			</div>

			<div class="grenade">
				<div class="img" v-html="image(require('../../img/weapons/hegrenade.svg'))" />
				<div class="count">{{ grenades.he }}</div>
			</div>
		</div>

		<SidebarPlayer
			v-for="(player, index) in players"
			:adr="adr[player.steamid]"
			:direction="direction"
			:freezetime="freezetime"
			:key="player.steamid"
			:observerSlot="observerSlotSortingEnabled ? (index + (direction === 'right' ? 6 : 1)) : player.observer_slot"
			:player="player"
			:side="side"
		/>
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
		'direction',
		'freezetime',
		'players',
		'side',
	],

	methods: {
		image(str) {
			return decodeURIComponent(str.replace(/^data:image\/svg\+xml,/, ''))
		},
	},

	computed: {
		...mapGetters([
			'map',
			'observerSlotSortingEnabled',
		]),

		equipmentValue() {
			return this.players.reduce((sum, player) => sum + player.state.equip_value, 0)
		},

		teamMoney() {
			return this.players.reduce((sum, player) => sum + player.state.money, 0)
		},

		lossBonusLevel() {
			return this.map[`team_${this.side}`].consecutive_round_losses
		},

		grenades() {
			const grenades = { smoke: 0, molotov: 0, flash: 0, he: 0 }

			for (const player of this.players) {
				for (const weapon in player.weapons) {
					const { name } = player.weapons[weapon]

					switch (name) {
						case 'weapon_smokegrenade':
							grenades.smoke++
							break

						case 'weapon_molotov':
						case 'weapon_incgrenade':
							grenades.molotov++
							break

						case 'weapon_flashbang':
							grenades.flash++
							break

						case 'weapon_hegrenade':
							grenades.he++
							break
					}
				}
			}

			return grenades
		},

		grenadeTotal() {
			return Object.values(this.grenades).reduce((carry, item) => {
				return carry + item
			})
		},
	},
}
</script>
