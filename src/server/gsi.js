import { additionalState, gsiState } from './state.js'

export const registerGsiRoutes = (router, websocket) => {
	router.post('/gsi', (context) => {
		const userAgent = context.request.headers['user-agent']
		if (! userAgent.startsWith('Valve/Steam HTTP Client')) return context.status = 400

		const body = context.request.body
		const authToken = body.auth.token

		if (authToken !== '7ATvXUzTfBYyMLrA') return context.status = 401

		const wasRoundFreezetime = gsiState.round?.phase === 'freezetime'

		updateGsiState(body)
		updateAdditionalState(body)

		if (! wasRoundFreezetime && gsiState.round?.phase === 'freezetime') {
			updateMoneyAtStartOfRound(body)
		}

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
	const { mapChanged } = updateLastKnownMapName(body)
	updateLastKnownBombPlantedCountdown(body)
	updateRoundDamages(body, mapChanged)
}

const updateLastKnownMapName = (body) => {
	const previousMapName = additionalState.lastKnownMapName

	additionalState.lastKnownMapName = body.map?.name

	return {
		mapChanged: additionalState.lastKnownMapName !== previousMapName,
	}
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

const updateMoneyAtStartOfRound = (body) => {
	additionalState.moneyAtStartOfRound = {}

	for (const [steam64Id, player] of Object.entries(body.allplayers || {})) {
		additionalState.moneyAtStartOfRound[steam64Id] = player.state.money
	}
}

const updateRoundDamages = (body, mapChanged) => {
	if (mapChanged || body?.player?.activity === 'menu') {
		additionalState.roundDamages = {}
		return
	}

	const roundNumber = body.map?.round + 1 - Number(body.phase_countdowns?.phase === 'over')
	if (! roundNumber) return

	for (const [steam64Id, player] of Object.entries(body.allplayers || {})) {
		if (! additionalState.roundDamages[steam64Id]) {
			additionalState.roundDamages[steam64Id] = {}
		}

		// CS2 (CS:GO maybe too) sometimes overwrites round_totaldmg with a zero once the player dies; work around that by ignoring zero if we already have a value set
		if (
			player.state.round_totaldmg !== 0
			|| ! additionalState.roundDamages[steam64Id].hasOwnProperty(roundNumber)
		) {
			additionalState.roundDamages[steam64Id][roundNumber] = player.state.round_totaldmg
		}
	}
}
