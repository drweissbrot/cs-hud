import { options } from '/hud/core/state.js'

export const getHiddenPlayers = () => {
	const hiddenPlayerNames = new Set()
	const hiddenPlayerSteam64Ids = new Set()

	const opt = options['teams.hiddenPlayers']?.trim()
	if (! opt?.length) return { hiddenPlayerNames, hiddenPlayerSteam64Ids }

	const lines = opt.split('\n')

	for (const rawLine of lines) {
		const line = rawLine.trim()
		if (! line?.length) continue

		if (/^7656\d+$/.test(line)) {
			hiddenPlayerSteam64Ids.add(line)
		} else {
			hiddenPlayerNames.add(line)
		}
	}

	return { hiddenPlayerNames, hiddenPlayerSteam64Ids }
}
