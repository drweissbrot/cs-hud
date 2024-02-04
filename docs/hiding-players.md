# Hiding Players

You can hide specific players if you don't want them to show up at all in the HUD.
This may be useful for coaches that are misrepresented as dead players.  
Please note that if you hide a real player, you will run into issues.

To hide a player, use the `teams.hiddenPlayers` option on the HUD config page at http://127.0.0.1:31982/config.
Provide either a player's SteamID64, or a player's name.
Provide one player per line.

If you use a player's name, you'll need to exactly match the name that would otherwise be displayed by the HUD.
If you've changed their name using [Player Name Overrides](https://github.com/drweissbrot/cs-hud/blob/master/docs/player-name-overrides.md), use the name that you used for the override.
