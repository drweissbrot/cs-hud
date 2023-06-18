import { gsiState, players } from '/hud/core/state.js'
import { parsePosition } from '/hud/gsi/parse-position.js'

const cachedFirebombTypes = {}

const getFirebombType = (grenadeId, owner) => {
	const ownerActiveGrenade = owner?.grenades?.find((nade) => nade.isActive)

	if (! ownerActiveGrenade) {
		return cachedFirebombTypes[grenadeId]
	}

	if (ownerActiveGrenade.name === 'weapon_incgrenade') {
		cachedFirebombTypes[grenadeId] = 'incgrenade'
		return 'incgrenade'
	}

	if (ownerActiveGrenade.name === 'weapon_molotov') {
		cachedFirebombTypes[grenadeId] = 'molotov'
		return 'molotov'
	}
}

const additionalGrenadeData = (grenade, grenadeId, owner) => {
	switch (grenade.type) {
		case 'inferno':
			return {
				flames: Object.entries(grenade.flames).map(([id, position]) => ({
					id,
					position: parsePosition(position),
				}))
			}

		case 'firebomb':
			return {
				firebombType: getFirebombType(grenadeId, owner),
			}

		case 'decoy':
		case 'smoke':
			return {
				effectTimeSec: Number(grenade.effecttime),
			}

		default: return {}
	}
}

export const parseGrenades = () => {
	const firebombGrenadeIds = new Set()

	const grenades = Object.entries(gsiState.grenades).map(([id, grenade]) => {
		const velocity = parsePosition(grenade.velocity)
		const owner = players.find((player) => player.steam64Id === grenade.owner)

		if (grenade.type === 'firebomb') {
			firebombGrenadeIds.add(id)
		}

		return {
			id,
			owner,
			velocity,

			isDetonated: velocity && velocity[0] === 0 && velocity[1] === 0 && velocity[2] === 0,
			lifeTimeSec: Number(grenade.lifetime),
			position: parsePosition(grenade.position),
			type: grenade.type,

			...additionalGrenadeData(grenade, id, owner),
		}
	})

	for (const id in cachedFirebombTypes) {
		if (! firebombGrenadeIds.has(id)) {
			delete cachedFirebombTypes[id]
			console.log('deleting', id)
		}
	}

	return grenades
}
