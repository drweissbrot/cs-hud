# Helpful CS Console Commands

Some of these commands for the Counter-Strike in-game console may be helpful in some situations.

## cl_draw_only_deathnotices
This command will hide the in-game HUD, everything except the kill feed.
The HUD does not include a kill feed (because kills are not provided by Game State Integration), so you'll need to use the in-game HUD's kill feed.

Example:
```
cl_draw_only_deathnotices true
```

## safezonex, safezoney
These commands will move the in-game HUD inwards a bit.
safezonex will make the kill feed line up vertically with the `Players Alive` element and the right sidebar.
safezoney will make the kill feed line up horizontally with the `Players Alive` element.

Example (for 16:9 aspect ratios):
```
safezonex 0.988
safezoney 0.98
```

## cl_spec_show_bindings
This command will hide the little text at the bottom of the screen that tells you what button to press to toggle the X-Ray, etc.

Example:
```
cl_spec_show_bindings false
```

## fps_max
In case of performance issues, e.g. choppy animations in the HUD.
Limiting the game's FPS can free up some GPU resources for the HUD.

Example:
```
fps_max 144
```
