# Player Name Overrides

You can force the HUD to use a manually specified name for a player.
This may be useful if a player's name is too long or uses unwanted characters.
Note that this override will not apply to the kill feed, which will still show the user's original in-game name.

To use player name overrides, use the `teams.playerNameOverrides` option on the HUD config page at http://127.0.0.1:31982/config.  
Provide a player's SteamID64, followed by a space, and the name you want to use for the player.
You can specify as many players as you want, separated by line breaks.

For example:
```
76561198067382161 Dr. Weissbrot
76561197961491680 tabseN
```

You can find SteamID64s by appending `?xml=1` to a user's Steam profile URL (e.g. `https://steamcommunity.com/id/drweissbrot?xml=1`, it's at the very top between the `<steamID64>` tags), or using [SteamDB's Calculator](https://steamdb.info/calculator) (it's the value labeled `SteamID`, usually starting with `7656`).

The first match will be used, i.e. if you have the same player listed twice, the second name will be ignored.
If you want to temporarily override a player's name, it's a good idea to add that override to the very beginning.
