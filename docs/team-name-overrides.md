# Team Name Overrides

You can force the HUD to use manually specified team names.
This may be useful if you don't have control over the `mp_teamname_1` etc. cvars of the game server, and/or if not all players use a clan tag.

To use team name overrides, use the `teams.teamNameOverrides` option on the HUD config page at http://127.0.0.1:31982/config.  
Provide a list of space-separated SteamID64s of the players in a team, followed by the team name.
You can specify as many teams as you want, and as many players per team as you want (at least one per team), separated by line breaks.

For example:
```
76561198067382161 76561198297703701 Breads
76561198443296177 The Enemy Team
```

You can find SteamID64s by appending `?xml=1` to a user's Steam profile URL (e.g. `https://steamcommunity.com/id/drweissbrot?xml=1`, it's at the very top between the `<steamID64>` tags), or using [SteamDB's Calculator](https://steamdb.info/calculator) (it's the value labeled `SteamID`, usually starting with `7656`).

The first match will be used, i.e. if you have the same player listed as part of two teams, the second team will be ignored.
If a player is standing on for another team, it's a good idea to add that player and the temporary team's name to the very beginning.
