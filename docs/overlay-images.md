# Overlay Images

You can provide images to overlay on some spots of the HUD, for example to promote sponsors or show your event's logo.
To use overlay images, first find your `userspace` folder.
If you're using a pre-packaged executable for running the HUD, it'll be inside the `cs-hud` directory in the same folder as the `cs-hud-win.exe`/`cs-hud-linux`.
<!-- TODO other ways of running -->
Alternatively, you can add overlay images to a theme instead.

Create an `overlay-images` directory in your `userspace` or theme folder, and save your overlay images in this directory.
Name each overlay file with the filename mentioned below, followed by the file extension, e.g. `focused-player-bottom.webp`.
WebP, PNG, and GIF are supported.
Note that animations (for transitions between multiple sponsors, for instance) are possible using all three of these formats.

All overlays will use the entire width they have available, and their height will scale accordingly.
Add some transparent space if you don't want them to take up the entire width.

These overlay spots are available:


### Focused Player Bottom
Filename: `focused-player-bottom`  
Default width at 1920x1080px viewport size: 467px

This overlay will be placed at the bottom center, just below the focused player.
It will not be visible during freezetimes.

In the default theme `fennec`, the solid-colored angled bars on the left and right sides of the focused player are at 20 degree angles.


### Sidebar Left and Right
Filename: `sidebar-left` or `sidebar-right`  
Default width at 1920x1080px viewport size: 397px

These overlays will be placed on top of the left or right sidebar, above the grenades and team equipment panels.
They will be pushed upwards by the team equipment panels during freezetimes.

The left sidebar overlay is usually not recommended because of spacing issues during freezetime:
In one-map series, there will be about 120px of height available on 1920x1080px viewports, in series with more maps less than 20px will be available.
