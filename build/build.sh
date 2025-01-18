#!/usr/bin/env bash

# This script...
#     duplicates the cs-hud repository (by git clone-ing it from the file system),
#     builds a Docker image with dependencies for electron-forge,
#     runs an ephemeral Docker container,
#     builds pre-packaged executables for Windows and Linux (see package.sh for details),
#     builds Electron-based wrappers around the HUD, config, and radar web pages,
#     deletes the Docker image,
#     zips/tar+gzips the browser wrapper directories,
#     and then cleans up after itself.
#
# The git clone is done to prevent untracked files from ending up in the binaries. I can save my social security number
# in the project directory, and as long as the file is not committed, it won't be in the binary.
# The build runs in a container so that it always uses the right version of Node (and all the usual benefits of Docker).
#
# Before running this script, make sure you've commited your changes. Uncommited changes are ignored for the build.
# For now, this only runs on Linux, not on Windows.

cd "$(dirname "$0")"

if [ -d tmp ]; then
	rm -r tmp
fi

mkdir -p tmp/bin
git clone --no-hardlinks .. tmp/clone

cp ./tmp/clone/gamestate_integration_drweissbrot_hud.cfg ./tmp/bin/gamestate_integration_drweissbrot_hud.cfg

docker build -t drweissbrot/cs-hud-build .

# build the main executable
docker run \
	--rm \
	-u node \
	-v ./tmp/bin:/home/node/bin \
	-v ./tmp/clone:/home/node/app \
	-w /home/node/app \
	drweissbrot/cs-hud-build \
	sh /home/node/app/build/package.sh

docker image rm drweissbrot/cs-hud-build

cd tmp/bin

# zip browser wrappers for Windows
zip -r cs-hud-config-win32-x64.zip cs-hud-config-win32-x64
zip -r cs-hud-overlay-win32-x64.zip cs-hud-overlay-win32-x64
zip -r cs-hud-radar-win32-x64.zip cs-hud-radar-win32-x64

# tar and gzip browser wrappers for Linux
tar -czf cs-hud-config-linux-x64.tar.gz cs-hud-config-linux-x64
tar -czf cs-hud-overlay-linux-x64.tar.gz cs-hud-overlay-linux-x64
tar -czf cs-hud-radar-linux-x64.tar.gz cs-hud-radar-linux-x64

cd ../..

# clean up
mv tmp/bin/cs-hud-linux tmp/bin/cs-hud-server-linux
mv tmp/bin/cs-hud-win.exe tmp/bin/cs-hud-server-win.exe

rm -r \
	tmp/bin/cs-hud-config-linux-x64 \
	tmp/bin/cs-hud-config-win32-x64 \
	tmp/bin/cs-hud-overlay-linux-x64 \
	tmp/bin/cs-hud-radar-linux-x64 \
	tmp/bin/cs-hud-radar-win32-x64 \
	tmp/bin/cs-hud-overlay-win32-x64 \
	tmp/clone
