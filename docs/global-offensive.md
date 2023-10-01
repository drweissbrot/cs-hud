# Using Counter-Strike: Global Offensive

This HUD was first created with CS:GO, and for the time being, will likely remain compatible with Global Offensive.  
Everything should work the same as it does in Counter-Strike 2.

## Setup
First, make sure you've opted into the `csgo_demo_viewer` beta branch for CS2 on Steam, and started Global Offensive at least once.

The setup for Game State Integration is the same as for CS2, but using the `csgo/cfg` directory instead of `game/csgo/cfg`.  
In detail, that means you need to head to your CS2 folder and the `csgo/cfg` subdirectory.
By default on Windows that is `C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo\cfg`.
You can also find it by opening your Steam library, right-clicking CS2, `Properties...`, `Installed Files`, `Browse...`, and then heading into the `csgo` directory, then `cfg`.
Save the [`gamestate_integration_drweissbrot_hud.cfg`](https://github.com/drweissbrot/cs-hud/releases/latest/download/gamestate_integration_drweissbrot_hud.cfg) file there, then restart CS:GO.
