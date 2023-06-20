#!/bin/bash

# This script duplicates the csgo-hud repository (by git clone-ing it from the file system), runs a Docker container,
# builds pre-packaged executables for Windows and Linux (see package.sh for details), and then cleans up after itself.
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

docker run \
	-u node \
	-v ./tmp/clone:/home/node/app \
	-v ./tmp/bin:/home/node/bin \
	-w /home/node/app \
	node:18-alpine \
	sh /home/node/app/build/package.sh

rm -r tmp/clone
