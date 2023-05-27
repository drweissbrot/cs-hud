import { gsiState, players } from '/hud/core/state.js'
import { parsePosition } from '/hud/gsi/parse-position.js'

const additionalGrenadeData = (grenade) => {
	switch (grenade.type) {
		case 'inferno':
			return {
				flames: Object.entries(grenade.flames).map(([id, position]) => ({
					id,
					position: parsePosition(position),
				}))
			}

		case 'decoy':
		case 'smoke':
			return {
				effectTimeSec: Number(grenade.effecttime),
			}

		default: return {}
	}
}

export const parseGrenades = () => Object.entries(gsiState.grenades).map(([id, grenade]) => ({
	id,

	isDetonated: grenade.velocity !== '[0, 0, 0]',
	lifeTimeSec: Number(grenade.lifetime),
	owner: players.find((player) => player.steam64Id === grenade.owner),
	position: parsePosition(grenade.position),
	type: grenade.type,
	velocity: parsePosition(grenade.velocity),

	...additionalGrenadeData(grenade),
}))
