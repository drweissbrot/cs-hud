import { readFileSync } from 'fs'
import { builtinRootDirectory } from './helpers/paths.js'

const getInitialState = () => {
	try {
		const state = readFileSync(`${builtinRootDirectory}/src/server/example-state.json`, 'utf-8')
		return JSON.parse(state)
	} catch {
		return {}
	}
}

export const gsiState = getInitialState()

export const additionalState = {
	lastKnownBombPlantedCountdown: {},
	lastKnownMapName: null,
	lastKnownPlayerObserverSlot: {},
	moneyAtStartOfRound: {},
	roundDamages: {},
}
