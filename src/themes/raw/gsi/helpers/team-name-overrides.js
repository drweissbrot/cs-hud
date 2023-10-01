import { options } from '/hud/core/state.js'

export const getTeamNameOverrides = () => {
	const teamNameOverrides = new Map()

	const opt = options['teams.teamNameOverrides']
	if (! opt?.trim()?.length) return teamNameOverrides

	const lines = opt.trim().split('\n')

	for (const line of lines) {
		const segments = line.trim().split(/\s+/)
		const teamNameSegments = []
		const teamSteam64Ids = new Set()

		for (const segment of segments) {
			if (/^\d+$/.test(segment) && segment.startsWith('7656')) {
				teamSteam64Ids.add(segment)
			} else {
				teamNameSegments.push(segment)
			}
		}

		if (! teamSteam64Ids.size || ! teamNameSegments.length) continue

		const teamName = teamNameSegments.join(' ')

		for (const steam64Id of teamSteam64Ids) {
			teamNameOverrides.set(steam64Id, teamName)
		}
	}

	return teamNameOverrides
}

export const getOverriddenTeamName = (teamNameOverrides, teamMembers) => {
	if (! teamNameOverrides?.size) return

	for (const player of teamMembers) {
		if (teamNameOverrides.has(player.steam64Id)) {
			return teamNameOverrides.get(player.steam64Id)
		}
	}
}
