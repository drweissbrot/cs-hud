# Theming

## Style Overrides
If you're using the default theme `fennec`, the most common styling changes (CT and T colors, font) can be applied using Style Overrides.
Open the HUD config page at http://localhost:31982/config and scroll down to `Style Overrides`:

### CT/T colors
Select the color you want to use, then press `Save` and `Force HUD Refresh`.
Most surfaces use the `css.terrorists-fill-rgb` color (and it's CT counterpart), most text uses `css.terrorists-text-rgb`, etc.
Note that color changes are only applied after refreshing the HUD.

### Primary Font Family
To change the font, type in the name of the font you want to use in the `css.primary-font-family` textbox, then press `Save` and `Force HUD Refresh`.
The font needs to be installed on your PC.
Note that font changes are only applied after refreshing the HUD.

### Base Scale Factor
If you want everything to be a bit more zoomed in or zoomed out, type something into the `css.base-scale-factor` textbox, then press `Save` and `Force HUD Refresh`.
By default this is roughly equivalent to `10px`, so if you want things to be twice as big, type in `20px`.
Things will likely break if you go too small or too big.
Note that changes to the scale factor are only applied after refreshing the HUD.


## Creating a Theme
Anything you can't achieve with Style Overrides, you can by using a theme.
Themes can append to, and override any file in their parent theme, and can add additional files.

Have a look at the `src/themes/fennec` directory; you can append to and override every file in there.

To create a theme, find the themes directory:
If you're using a pre-packaged executable for running the HUD, it'll be a `cs-hud` directory in the same folder as the `cs-hud-win.exe`/`cs-hud-linux`.
<!-- TODO other ways of running -->

Create a new folder in the themes directory; the name of that directory will be the name of your theme.  
Inside your newly created folder, create a file called `theme.json` with the following contents:
```json
{
	"parent": "fennec"
}
```
This will tell the HUD that your theme extends the base theme, `fennec`.

Switch to your theme by opening the HUD config page at http://localhost:31982/config, and type in your theme's name in the `theme` text box near the top, then press `Save`.

### Applying changes
You can work on your HUD by opening http://localhost:31982/hud in your favorite browser.

Note that the HUD does not apply styling changes automatically while it's active; you need to refresh it every time.
In a browser, just press `Ctrl`+`R`/`F5`/the refresh button; if you're using the HUD within OBS, or otherwise can't interact with it directly, click the `Force HUD Refresh` button on the config page at http://localhost:31982/config.

### Creating a theme (mostly) from scratch
If you want your instance of the HUD to be very different visually from the default theme, you can use `raw` as a parent instead.
This is a lot of work and usually **not recommended.**
Consider using `fennec` as your parent theme instead.

`raw` provides communications with the server side, a couple helper functions, and an entry point for your own theme.
To use `raw` as a parent, set the value of `parent` in your `theme.json` to `raw`.

Override the `shell` Vue component defined by `raw` to get started:
Create a `shell/shell.html`; it'll serve as the markup for your main Vue component.
Create a `shell/shell.css`; this can be empty, but will remove most styles added by `raw`.
Create a `shell/shell.js`; this will probably mostly serve as a component register.
For example:

```js
// shell/shell.js
import FocusedPlayer from '/hud/focused-player/focused-player.vue'

export default {
	components: {
		FocusedPlayer,
	},
}
```

This `shell/shell.js`, combined with a VUe component in the `focused-player` directory, would enable you to use `<FocusedPlayer />` in your `shell/shell.html`.

### Themes without a parent
You don't necessarily have to use a parent theme, but nothing will be done for you.
You'd even have to interact with the server side yourself.
This is an insane amount of work and not recommended.
Consider using `raw` as your parent theme instead.

If you don't want to use a parent theme, omit the `parent` in `theme.json`.
You'll need to create an `index.html`, which will serve as your entry point.
See [src/themes/raw/index.html](src/themes/raw/index.html) for inspiration.


## Appending to Files
You can append to your parent theme's files by adding `.append` to the file name, just before the file extension.
For example, to override `src/themes/fennec/players-alive/players-alive.css`, create `my-theme/players-alive/players-alive.append.css`.
Note that this will just concatenate both files without any merging logic.
This can be useful for CSS, where you can just override things by creating a new selector.

For example, if your parent theme defined this CSS for the "Players Alive" component (which shows the number of players alive per team):
```css
/* src/themes/fennec/players-alive/players-alive.css */
.team.--ct {
	background: lightblue;
	color: black;
}

.team.--t {
	background: orange;
	color: white;
}
```

You could create this file in your own theme to append to it:
```css
/* my-theme/players-alive/players-alive.append.css */
.team.--ct {
	background: darkblue;
	color: white;
}
```

Which would result in this CSS being loaded by the HUD frontend:
```css
.team.--ct {
	background: lightblue;
	color: black;
}

.team.--t {
	background: orange;
	color: white;
}

.team.--ct {
	background: darkblue;
	color: white;
}
```
Because of the way CSS works, the browser would essentially "discard" the `background` and `color` specified by the parent theme, and use your values instead.

You can also use this to remove or reset a style.
For example, this could would reset the text color value of `.team.--ct` to the browser's defaults:
```css
.team.--ct {
	color: unset;
}
```

### Overriding CSS variables
The default theme `fennec` uses CSS variables for most colors and many other values.
These variables are defined in `src/themes/fennec/css/vars`, and you can override them by appending to those files.

For example, the color of money in the sidebars is defined by the CSS variable `--sidebar-player-money-text`, found in `src/themes/fennec/css/vars/colors.css`.
To override this, create `my-theme/css/vars/colors.append.css` with the following contents:
```css
/* my-theme/css/vars/colors.append.css */
:root {
	--sidebar-player-money-text: #d400cb;
}
```

Depending on your preferences, you can also just create a single `my-theme/css/vars/vars.append.css`, and create a single `:root { /* ... */ }` block with all your variable overrides in there.

Give the HUD a refresh to apply your override.
If you're not seeing the HUD, you can open http://localhost:31982/hud in your favorite browser.
If you're using it in OBS or otherwise can't directly interact with the HUD page, you can click `Force HUD Refresh` on the config page instead.


## Overriding Files
You can also completely replace a file by creating a file of the same name in your theme.
For example, to override `src/themes/fennec/players-alive/players-alive.html`, create `my-theme/players-alive/players-alive.html`.
You'll need to do this if you want to make changes to an HTML or JS file.

For example, to replace the letter `K` that prefixes the kill count in the sidebar with an icon, create `my-theme/sidebars/sidebar/player/kills/kills.html`, and copy in the contents of the original [src/themes/fennec/sidebars/sidebar/player/kills/kills.html](src/themes/fennec/sidebars/sidebar/player/kills/kills.html).

Replace the line `<div :class="['label', colorClass]">K</div>` with the following:
```xml
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 32" height="12"><path fill="#fff" fill-rule="evenodd" d="M24.44 16.72c.02-1.73-.59-1.77-.63-2.83-.02-.53.05-2.03 0-3.46a17.5 17.5 0 0 0-.31-3.15c-.24-.67-.5-1.78-2.52-3.47-2.2-1.85-6.46-3.43-8.82-3.46C9.8.3 7.04 1.49 4.9 2.87 2.8 4.24 2.27 4.83 1.45 6 .62 7.2.3 8.02.5 10.11c.2 2.09.25 1.54.32 3.46.06 1.6-.67 2.1-.63 3.16.05 1.58.65 1.91.63 2.52-.02.4-.71.89-.63 2.2.08 1.34.35 1.7 2.83 3.15 1.61.95 3.5 1.3 3.47 1.89-.06.87-.28 2.28-.32 3.15-.04.87.36.95 1.26 1.26.91.32 3.04.98 5.36.95 2.32-.05 3.3-.52 4.4-.95 1.11-.43 1.27-.83 1.27-1.57 0-.75-.63-2.29-.63-2.84 0-.55 1.89-1.14 4.1-2.2 2.2-1.07 2.17-2.13 2.2-2.84.05-1.34-.63-1.65-.63-2.2 0-1.08.93-1.27.94-2.53ZM5.86 19.87c-1.1.04-3.47.04-3.47-3.15 0-4.41 2.36-4.92 4.1-5.04 1.73-.11 1.97-.31 2.83.32 1.56 1.13 1.46 3.14.95 4.72a3.78 3.78 0 0 1-1.58 2.2 4.8 4.8 0 0 1-2.83.95Zm7.24 5.04-.43-1.6H12l-.47 1.6c-1.81-.49-2.54-1.21-2.52-2.2.02-.98.57-2 1.57-2.84 1-.82 1.17-.95 1.9-.94.68.01.74.14 1.25.63 1.1 1.05 1.81 1.75 1.9 3.15.08 1.38-1.52 2.14-2.53 2.2Zm5.67-5.04a4.9 4.9 0 0 1-2.83-.94 3.53 3.53 0 0 1-1.58-2.2c-.4-1.49-.6-3.6.95-4.73.87-.63 1.1-.43 2.83-.32 1.73.12 4.1.63 4.1 5.04 0 3.2-2.36 3.2-3.47 3.15Z" clip-rule="evenodd"/></svg>
```

Give the HUD a refresh, and there'll now be a skull icon instead of a `K`.


## Adding Files
You can of course also add additional files.
For example, if you've followed the instructions in [Overriding Files](#overriding-files) above, create `my-theme/img/icons/kills.svg`, and paste in the SVG code from above.
Now replace the SVG code you added in `my-theme/sidebars/sidebar/player/kills/kills.html` with just `<img src="/hud/img/icons/kills.svg">`.
The HUD should still show a skull after refreshing, but the skull will now be laoded from the image file instead.


## Import files from a parent theme (JavaScript)
You can override parts of a JS file by importing the original file from your parent theme, and re-exporting the imported object.
To import a file from the parent theme (or any other available theme, for that matter), append `?theme=PARENT_THEME_NAME_HERE` to its address.

For example, if you want everyone to always have 100 kills, create `my-theme/focused-player/name-and-stats/data-row/stats/stat/stat.js`, with these contents:
```js
// this line will import `stat.js` from fennec, and make it available as `Stat` in this JS module
import Stat from '/hud/focused-player/name-and-stats/data-row/stats/stat/stat.js?theme=fennec'

// we need to export a Vue component, just like the parent theme does
export default {
	...Stat, // this will include everything from the original `Stat`, thanks to the spread operator (the three dots) -- we'll put this in first, everything that comes after this will override the base `Stat`

	// the kill value is within the `computed` object
	computed: {
		...Stat.computed, // again, import everything from the `computed` object in the original `Stat`

		// `value` is where `Stat` gets the kill number from
		value() {
			// we have everything from the original `Stat` available, so we can check if the value we're currently getting is kills (this same component is also used for assists, deaths, and ADR)
			if (this.type === 'kills') {
				return 100 // ... and if it is kills, just return 100
			}

			// if it isn't kills, we can fall back to calling the original method and get the real values
			return Stat.computed.value.call(this)
		},
	},
}
```
