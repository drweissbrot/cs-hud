#!/bin/bash

# This script...
#     duplicates the csgo-hud repository (by git clone-ing it from the file system),
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

docker build -t drweissbrot/csgo-hud-build .

# build the main executable
docker run \
	--rm \
	-u node \
	-v ./tmp/bin:/home/node/bin \
	-v ./tmp/clone:/home/node/app \
	-w /home/node/app \
	drweissbrot/csgo-hud-build \
	sh /home/node/app/build/package.sh

docker image rm drweissbrot/csgo-hud-build

cd tmp/bin

# zip browser wrappers for Windows
zip -r csgo-hud-config-win32-x64.zip csgo-hud-config-win32-x64
zip -r csgo-hud-radar-win32-x64.zip csgo-hud-radar-win32-x64
zip -r csgo-hud-win32-x64.zip csgo-hud-win32-x64

# tar and gzip browser wrappers for Linux
tar -czf csgo-hud-config-linux-x64.tar.gz csgo-hud-config-linux-x64
tar -czf csgo-hud-linux-x64.tar.gz csgo-hud-linux-x64
tar -czf csgo-hud-radar-linux-x64.tar.gz csgo-hud-radar-linux-x64

cd ../..

# clean up
rm -r \
	tmp/bin/csgo-hud-config-linux-x64 \
	tmp/bin/csgo-hud-config-win32-x64 \
	tmp/bin/csgo-hud-linux-x64 \
	tmp/bin/csgo-hud-radar-linux-x64 \
	tmp/bin/csgo-hud-radar-win32-x64 \
	tmp/bin/csgo-hud-win32-x64 \
	tmp/clone
