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


## Step by Step
This is not necessarily the most efficient way to do it, but if you're not sure, try following along:

<!-- TODO possibly mention other ways of running? -->
Make sure the HUD is running (specifically the `cs-hud-win.exe` or `cs-hud-linux`).

For at least one player in every team:
1. Go to their Steam profile.
2. Copy the link to their profile. In browser, copy from the address bar. In Steam client, right-click on the page, click `Copy Page URL`.
3. Go to https://steamdb.info/calculator/, and paste the link in there.
4. On the page that opens, scroll down a bit. Under the `SteamID` section, copy the value for `SteamID`. It's the long number starting with `7656`.
5. Go to http://127.0.0.1:31982/config, and scroll down to `Teams`.
6. Paste the SteamID you copied before (the `7656` number) in the textbox labeled `teams.teamNameOverrides`. Put a space behind the number, then write the team name, exactly as you want it to be displayed in the HUD.
7. Press `Save`.

For example, for a match BIG vs. 9INE, you could put in this:
```
76561197961491680 BIG
76561198081687729 9INE
```

If you want to be sure, include a line for every player in every team.  
The team names will only appear if you're spectating a match with a matching player. So for the example above, you'd have to find a demo or GOTV server from a BIG vs. 9INE match.
