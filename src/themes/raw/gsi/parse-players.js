import { additionalState, gsiState, options } from '/hud/core/state.js'
import { parsePosition } from '/hud/gsi/parse-position.js'
import { grenadeOrderIndices } from '/hud/gsi/helpers/grenade-order-indices.js'
import { getPlayerNameOverrides } from '/hud/gsi/helpers/player-name-overrides.js'
import { getHiddenPlayers } from '/hud/gsi/helpers/hidden-players.js'

// a CS2 update mid-November 2023 changed observer slots to be `0` for the player with the hotkey `1`, `1` for hotkey `2`, ..., `9` for hotkey `0`
const getObserverSlot = (player, steam64Id) => {
	const rawSlot = player.observer_slot ?? additionalState.lastKnownPlayerObserverSlot?.[steam64Id]
	if (options['preferences.isCsgo']) return rawSlot

	if (rawSlot === undefined) return
	if (rawSlot === 9) return 0
	return rawSlot + 1
}

const parsePlayerWeapons = (player) => Object.values(player.weapons).flatMap((weapon) => {
	const parsed = {
		ammoClip: weapon.ammo_clip,
		ammoClipMax: weapon.ammo_clip_max,
		ammoReserve: weapon.ammo_reserve,
		isActive: weapon.state === 'active',
		isBomb: weapon.type === 'C4',
		isGrenade: weapon.type === 'Grenade',
		isMelee: weapon.type === 'Knife',
		isPistol: weapon.type === 'Pistol',
		isPrimary: ['Machine Gun', 'Rifle', 'Shotgun', 'SniperRifle', 'Submachine Gun'].includes(weapon.type),
		isTaser: weapon.name === 'weapon_taser', // weapon.type is undefined for taser
		name: weapon.name,
		paintkit: weapon.paintkit,
		state: weapon.state,
		type: weapon.type,
		unprefixedName: weapon.name.replace(/^weapon_/, ''),
	}

	if (parsed.name === 'weapon_flashbang' && parsed.ammoReserve >= 2) return [parsed, { ...parsed, isActive: false }]

	return [parsed]
}).sort((a, b) => {
	if (a.isGrenade && b.isGrenade) {
		return grenadeOrderIndices[a.name] - grenadeOrderIndices[b.name]
	}

	if (a.isGrenade) return 1
	if (b.isGrenade) return -1

	if (a.name > b.name) return 1
	if (a.name < b.name) return -1

	if (a.isActive !== b.isActive) return b.isActive - a.isActive

	return 0
})

// TODO if we want an `isBot` or similar: bots appear to use steam ids, starting at 76561197960265729 and counting up from there (these are real steam64Ids though, belonging to real Steam users)
export const parsePlayers = () => {
	const playerNameOverrides = getPlayerNameOverrides()
	const { hiddenPlayerNames, hiddenPlayerSteam64Ids } = getHiddenPlayers()

	const players = []

	for (const [steam64Id, player] of Object.entries(gsiState.allplayers)) {
		if (hiddenPlayerSteam64Ids.has(steam64Id)) continue

		const name = playerNameOverrides.get(steam64Id) || player.name
		if (hiddenPlayerNames.has(name)) continue

		const observerSlot = getObserverSlot(player, steam64Id)
		if (observerSlot === undefined) continue

		const weapons = parsePlayerWeapons(player)
		const grenades = []

		let bomb
		let knife
		let primary
		let secondary
		let taser

		for (const weapon of weapons) {
			if (weapon.isGrenade) grenades.push(weapon)
			else if (weapon.isKnife) knife = weapon
			else if (weapon.isPistol) secondary = weapon
			else if (weapon.isPrimary) primary = weapon
			else if (weapon.isBomb) bomb = weapon
			else if (weapon.isTaser) taser = weapon
		}

		const kdRatio = player.match_stats?.kills / (player.match_stats?.deaths || 1)

		players.push({
			bomb,
			grenades,
			kdRatio,
			knife,
			name,
			observerSlot,
			primary,
			secondary,
			steam64Id,
			taser,
			weapons,

			adr: getAdr(steam64Id),
			armor: player.state?.armor,
			assists: player.match_stats?.assists,
			clanTag: player.clan,
			deaths: player.match_stats?.deaths,
			equipmentValue: player.state?.equip_value,
			forward: parsePosition(player.forward),
			hasArmor: player.state?.armor > 0,
			hasBadKdRatio: kdRatio <= options['preferences.maximumBadKdRatio'],
			hasBomb: !! bomb,
			hasDefuser: !! player.state?.defusekit,
			hasGoodKdRatio: kdRatio >= options['preferences.minimumGoodKdRatio'],
			hasGrenades: grenades.length > 0,
			hasHelmet: !! player.state?.helmet,
			hasKnife: !! knife,
			hasPrimary: !! primary,
			hasSecondary: !! secondary,
			hasTaser: !! taser,
			health: player.state?.health,
			isAlive: player.state?.health > 0,
			isBurning: !! player.state?.burning, // TODO why is this a number instead of a boolean?
			isFlashed: !! player.state?.flashed, // TODO why is this a number instead of a boolean?
			isFocused: gsiState.player?.steamid === steam64Id,
			kills: player.match_stats?.kills,
			money: player.state?.money,
			mvps: player.match_stats?.mvps,
			position: parsePosition(player.position),
			roundDamage: player.state?.round_totaldmg,
			roundDamages: additionalState.roundDamages?.[steam64Id] || [],
			roundHeadshotKills: player.state?.round_killhs,
			roundKills: player.state?.round_kills,
			roundMoneySpent: getRoundMoneySpent(steam64Id, player),
			score: player.match_stats?.score,
			side: player.team === 'CT' ? 3 : 2,
			team: undefined,
		})
	}

	return players.sort((a, b) => {
		const x = a.observerSlot === 0 ? 10 : a.observerSlot
		const y = b.observerSlot === 0 ? 10 : b.observerSlot
		return x - y
	})
}

const getAdr = (steam64Id) => {
	let totalDamage = 0
	let rounds = 0

	const roundDamages = Object.entries(additionalState.roundDamages?.[steam64Id] || {})
	const currentRoundNumber = gsiState.map.round + 1 // this ends up being the following round during the round restart delay (e.g. in the 5 (or 7) seconds after round 1, this will be `2`), but since ADR should already update then, this is actually what we want

	for (const [roundNumber, damage] of roundDamages) {
		if (roundNumber < 1) continue
		if (roundNumber >= currentRoundNumber) break

		totalDamage += damage
		rounds++
	}

	return Math.floor(totalDamage / (rounds || 1))
}

const getRoundMoneySpent = (steam64Id, player) => {
	if (! additionalState.moneyAtStartOfRound?.[steam64Id]) return 0

	const spent = additionalState.moneyAtStartOfRound?.[steam64Id] - player.state.money
	if (Number.isNaN(spent) || spent < 0) return 0

	return spent
}
