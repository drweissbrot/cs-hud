# Release Checklist

**NB!** This is only relevant to maintainers of this project.
You can most likely ignore it.

This document is an overview of how to release a new version of this HUD.  
Replace `0.0.0` with the release's version number, and `1970-01-01` with the UTC date of the release.

1. Commit/merge all changes that should be part of the release to the `master` branch.
2. Create a new commit on `master` with the message `release 0.0.0`. As part of this commit:
	1. Update `src/version.txt` to the new version number.
	2. In `changelog.md`, move the entries under the `## [Unreleased]` heading to a new heading `## [0.0.0] - 1970-01-01`. Keep the `## [Unreleased]` heading with no items under it, and follow the line spacing (1 empty line between level 3 headings, 2 empty lines between level 2 headings).
3. After committing the above changes, run `build/build.sh`. Avoid interacting with the files in `build/tmp`.
4. Push these changes to GitHub.
5. [Create a new release](https://github.com/drweissbrot/cs-hud/releases/new).
	1. Choose `v0.0.0` as the tag (select `Create new tag: v0.0.0 on publish`).
	2. Title it `v0.0.0`.
	3. Copy the entries for this release from `changelog.md` into the release description.
	4. Click `Generate release notes`.
	5. If applicable, check `Set as the latest release` or `Set as a pre-release`.
	6. Upload all files from `build/tmp/bin`, including `gamestate_integration_drweissbrot_hud.cfg`.
6. Publish the release.


## Version Numbers
This project does not adhere to Semantic Versioning (because the "override things" approach to theming makes almost every change a potentially breaking change), but still roughly follows the idea.

Version numbers are formatted `MAJOR.MINOR.PATCH`.

If a release only contains bug fixes, increment `PATCH` by 1.  
If a release contains new features, or changes to behavior or default values, increment `MINOR` by 1, and reset `PATCH` to `0`.  
If a release drastically changes how the software works, increment `MAJOR` by 1, and reset `MINOR` and `PATCH` to `0`.
