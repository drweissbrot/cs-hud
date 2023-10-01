# Team Logos

You can provide logo images for teams that will be displayed in the bar at the top.
To use logo images, first find your `userspace` folder.
If you're using a pre-packaged executable for running the HUD, it'll be inside the `cs-hud` directory in the same folder as the `cs-hud-win.exe`/`cs-hud-linux`.
<!-- TODO other ways of running -->
Alternatively, you can add team logos to a theme instead.

Create a `team-logos` directory in your `userspace` or theme folder, and put the teams' logos in there.
Name each file with the team name followed by the `.png` file extension, for example `Ben's Anime Team.png`.

Only PNG files are supported.  
File names must exactly match the name that will be displayed in the top bar, including uppercase/lowercase.
If you're using [Team Name Overrides](/docs/team-name-overrides.md), use tne team name you've provided in the `teams.teamNameOverrides` option.
