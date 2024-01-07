import { bomb, grenades, gsiState, map, misc, players, round, rounds, teams } from '/hud/core/state.js'
import { parseBomb } from '/hud/gsi/parse-bomb.js'
import { parseGrenades } from '/hud/gsi/parse-grenades.js'
import { parseMap } from '/hud/gsi/parse-map.js'
import { parseMisc } from '/hud/gsi/parse-misc.js'
import { parsePlayers } from '/hud/gsi/parse-players.js'
import { parseRound } from '/hud/gsi/parse-round.js'
import { parseRounds } from '/hud/gsi/parse-rounds.js'
import { parseTeams } from '/hud/gsi/parse-teams.js'

export const parseGsiState = () => {
	if (! gsiState?.map) return

	players.splice(0, players.length, ...parsePlayers())
	players.focused = gsiState.player?.steamid ? players.find((player) => player.steam64Id === gsiState.player.steamid) : undefined
	teams.splice(0, teams.length, ...parseTeams()) // this depends on players already being updated
	rounds.splice(0, rounds.length, ...parseRounds()) // this depends on teams already being updated
	grenades.splice(0, grenades.length, ...parseGrenades())

	Object.assign(bomb, parseBomb())
	Object.assign(misc, parseMisc())
	Object.assign(map, parseMap())
	Object.assign(round, parseRound())
}
