import { options } from '/hud/core/state.js'

export const getPlayerNameOverrides = () => {
	const playerNameOverrides = new Map()

	const opt = options['teams.playerNameOverrides']
	if (! opt?.trim()?.length) return playerNameOverrides

	const lines = opt.trim().split('\n')

	for (const line of lines) {
		const segments = line.trim().split(/\s+/)
		if (
			segments.length < 2
			|| ! /^\d+$/.test(segments[0])
			|| ! segments[0].startsWith('7656')
			|| ! segments[1]
		) continue

		playerNameOverrides.set(segments[0], segments.slice(1).join(' '))
	}

	return playerNameOverrides
}
