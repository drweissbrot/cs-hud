import { additionalState, gsiState } from '/hud/core/state.js'
import { parsePosition } from '/hud/gsi/parse-position.js'

// TODO if we want an `isBot` or similar: bots appear to use steam ids, starting at 76561197960265729 and counting up from there (these are real steam64Ids though, belonging to real Steam users)
export const parsePlayers = () => Object.entries(gsiState.allplayers).map(([steam64Id, player]) => {
	const weapons = Object.values(player.weapons).map((weapon) => ({
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
	}))

	return {
		steam64Id,
		weapons,

		adr: 0, // TODO
		armor: player.state?.armor,
		assists: player.match_stats?.assists,
		clanTag: player.clan,
		deaths: player.match_stats?.deaths,
		equipmentValue: player.state?.equip_value,
		forward: parsePosition(player.forward),
		grenades: weapons.filter((weapon) => weapon.isGrenade),
		hasArmor: player.state?.armor > 0,
		hasBomb: weapons.some((weapon) => weapon.isBomb),
		hasDefuser: player.state?.defusekit,
		hasHelmet: player.state?.helmet,
		hasTaser: weapons.some((weapon) => weapon.isTaser),
		health: player.state?.health,
		isAlive: player.state?.health > 0,
		isBurning: !!player.state?.burning, // TODO why is this a number instead of a boolean?
		isFlashed: !!player.state?.flashed, // TODO why is this a number instead of a boolean?
		isFocused: gsiState.player?.steamid === steam64Id,
		kdRatio: player.match_stats?.kills / (player.match_stats?.deaths || 1),
		kills: player.match_stats?.kills,
		knife: weapons.find((weapon) => weapon.isKnife),
		money: player.state?.money,
		mvps: player.match_stats?.mvps,
		name: player.name,
		observerSlot: player.observer_slot,
		position: parsePosition(player.position),
		primary: weapons.find((weapon) => weapon.isPrimary),
		roundDamage: player.state?.round_totaldmg, // TODO this is often wrong
		roundDamages: additionalState.roundDamages?.[steam64Id] || [],
		roundHeadshotKills: player.state?.round_killhs,
		roundKills: player.state?.round_kills,
		roundMoneySpent: 0, // TODO
		score: player.match_stats?.score,
		secondary: weapons.find((weapon) => weapon.isPistol),
		side: player.team === 'CT' ? 3 : 2,
		team: undefined,
	}
}).sort((a, b) => {
	const x = a.observerSlot === 0 ? 10 : a.observerSlot
	const y = b.observerSlot === 0 ? 10 : b.observerSlot
	return x - y
})
