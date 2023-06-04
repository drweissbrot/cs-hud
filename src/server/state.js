import { readFileSync } from 'fs'

const getInitialState = () => {
	try {
		const state = readFileSync('src/server/example-state.json', 'utf-8')
		return JSON.parse(state)
	} catch {
		return {}
	}
}

export const gsiState = getInitialState()

export const additionalState = {
	lastKnownBombPlantedCountdown: {},
	roundDamages: {},
}
