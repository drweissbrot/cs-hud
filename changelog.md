# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project does not adhere to Semantic Versioning.

## [Unreleased]
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
