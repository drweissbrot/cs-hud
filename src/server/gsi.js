import { additionalState, gsiState } from './state.js'

export const registerGsiRoutes = (router, websocket) => {
	router.post('/gsi', (context) => {
		const userAgent = context.request.headers['user-agent']
		if (! userAgent.startsWith('Valve/Steam HTTP Client')) return context.status = 400

		const body = context.request.body
		const authToken = body.auth.token

		if (authToken !== '7ATvXUzTfBYyMLrA') return context.status = 401

		updateGsiState(body)
		updateAdditionalState(body)

		// console.debug(JSON.stringify(gsiState, null, '\t'))

		websocket.broadcastState()

		return context.status = 204
	})
}

const updateGsiState = (body) => {
	for (const [key, value] of Object.entries(body)) {
		if (key === 'added' || key === 'auth' || key === 'previously') continue
		gsiState[key] = value
	}
}

const updateAdditionalState = (body) => {
	updateLastKnownBombPlantedCountdown(body)
	updateRoundDamages(body)
}

const updateLastKnownBombPlantedCountdown = (body) => {
	const bomb = body.bomb
	if (bomb?.state === 'defusing') return

	if (! bomb || bomb.state !== 'planted') {
		additionalState.lastKnownBombPlantedCountdown = {}
		return
	}

	additionalState.lastKnownBombPlantedCountdown = {
		unixTimestamp: +new Date(),
		value: bomb.countdown,
	}
}

const updateRoundDamages = (body) => {
	const roundNumber = body.map?.round
	if (! roundNumber) return

	for (const [steam64Id, player] of Object.entries(body.players || {})) {
		if (! additionalState.roundDamages[steam64Id]) {
			additionalState.roundDamages[steam64Id] = []
		}

		additionalState.roundDamages[steam64Id][roundNumber] = player.state.round_totaldmg
	}
}
