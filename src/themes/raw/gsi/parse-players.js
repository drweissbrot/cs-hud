import { additionalState, gsiState, options } from '/hud/core/state.js'
import { parsePosition } from '/hud/gsi/parse-position.js'
import { grenadeOrderIndices } from '/hud/gsi/helpers/grenade-order-indices.js'

// TODO if we want an `isBot` or similar: bots appear to use steam ids, starting at 76561197960265729 and counting up from there (these are real steam64Ids though, belonging to real Steam users)
export const parsePlayers = () => Object.entries(gsiState.allplayers).map(([steam64Id, player]) => {
	const weapons = Object.values(player.weapons).flatMap((weapon) => {
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

	return {
		bomb,
		grenades,
		kdRatio,
		knife,
		primary,
		secondary,
		steam64Id,
		taser,
		weapons,

		adr: 0, // TODO
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
		name: player.name,
		observerSlot: player.observer_slot,
		position: parsePosition(player.position),
		roundDamage: player.state?.round_totaldmg, // TODO this is often wrong
		roundDamages: additionalState.roundDamages?.[steam64Id] || [],
		roundHeadshotKills: player.state?.round_killhs,
		roundKills: player.state?.round_kills,
		roundMoneySpent: 0, // TODO
		score: player.match_stats?.score,
		side: player.team === 'CT' ? 3 : 2,
		team: undefined,
	}
}).sort((a, b) => {
	const x = a.observerSlot === 0 ? 10 : a.observerSlot
	const y = b.observerSlot === 0 ? 10 : b.observerSlot
	return x - y
})
