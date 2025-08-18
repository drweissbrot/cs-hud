# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project does not adhere to Semantic Versioning.

## [Unreleased]
### Added
* Added `teams.hideCoachesByName` option (disabled by default), which hides any player that has the word `coach` in their name


## [2.6.2] - 2025-07-05
### Fixed
* Fixed series graph sometimes not disappearing when only one map is set
* Fixed long nicknames sometimes wrapping into multiple lines

### Changed
* Updated several dependencies
* Disabled compression for server binaries


## [2.6.1] - 2025-01-19
### Fixed
* Fixed pre-built Windows binary immediately crashing on startup


## [2.6.0] - 2025-01-18
### Added
* When a map screenshot is not found or fails to load, series graph will now show a fallback image

### Fixed
* Null-ish values (e.g. the number `0` for 16-0 matches) will now be saved when entered on the config page

### Changed
* Updated various dependencies (node to v22, electron to v34)
* Switched to @yao-pkg/pkg for building pre-packaged binaries
* Map screenshots and radars are now saved in PNG format instead of WebP
* Updated map screenshots and radars to CS2
* Changed filenames for server and overlay binaries; server is now `cs-hud-server-linux`/`cs-hud-server-win.exe` (previously `cs-hud-linux`/`cs-hud-win.exe`), overlay is now in `cs-hud-overlay-linux-x64.tar.gz`/`cs-hud-overlay-win32-x64.zip` (previously `cs-hud-linux-x64.tar.gz`/`cs-hud-win32-x64.zip`)

### Removed
* Removed map screenshots from CS:GO; now included by default are only map screenshots for maps that were officially included in the game as of 2025-01-18
* Removed some legacy radars (primarily outdated Simple Radar radars); all maps that used to be included should still be included, but some alternative variants of their radars may not be included anymore


## [2.5.0] - 2024-03-02
### Added
* Added fallback for wrong GSI-reported inferno flame positions

### Changed
* Players who disconnected before match start are now hidden


## [2.4.0] - 2024-02-04
### Added
* Added `teams.hiddenPlayers` (theme `raw`) to hide autokilled coaches in Faceit matches


## [2.3.1] - 2024-01-21
### Fixed
* Fix loss bonus increasing past $3400
* Fix disconnected players being displayed with observer slot `NaN`


## [2.3.0] - 2024-01-07
### Fixed
* Fix window title bar sometimes appearing in HUD view Electron windows

### Changed
* `cvars.mp_maxrounds` now defaults to `24`, which is the default value in CS2
* Focused player section (bottom center) will now be hidden when in third person/freecam


## [2.2.0] - 2023-11-22
### Added
* Added optional overlay corners to show that the HUD is active (enabled by default in the Electron overlay binary; can be enabled by appending `?corners`/`?transparent&corners` to the URL)
* Added `preferences.isCsgo` option on the config page (theme `raw`) for backwards-incompatible changes to CS:GO

### Fixed
* Fix invalid theme completely breaking config page
* Fix missing `player` in GSI payload breaking everything (potentially; could not reproduce issue)
* Fix observer slots being offset by -1 in CS2
* Fix dead players following the player they're spectating on the minimap


## [2.1.1] - 2023-10-02
### Fixed
* Fix round damage sometimes not being counted for ADR when player died
* Fix console errors caused by missing bomb during warmup


## [2.1.0] - 2023-10-01
### Added
* Add Team Name Overrides
* Add Team Logos
* Add overlay images (e.g. for sponsors)
* Add CSS variable `--sidebar-vertical-spacing` (default: `0.5rem`) to control margin between all elements
* Add Player Name Overrides
* Add option to highlight focused player's HP in red if it's less than a configured value

### Changed
* Grenade counts in team grenades panels will now be grayed out if the team has no grenades of the type


## [2.0.0] - 2023-09-30
* Complete rewrite; expect everything to work differently than before.
* The previous version will likely continue to work (even with CS2), but will not receive updates or support.


## Earlier releases
Before the [v2 Rewrite](https://github.com/drweissbrot/cs-hud/issues/52), this project did not use versioning, nor did it keep a changelog.
This file will only include changes from v2 onwards.
