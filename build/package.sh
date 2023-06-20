#!/bin/bash

# This script is called from within the Docker container created by build.sh.
# Run build.sh instead. Don't run this script directly.

yarn --frozen-lockfile

yarn licenses generate-disclaimer > assets/licenses.txt

npx esbuild src/server/index.js --bundle --platform=node --outfile=csgo-hud.js

npx pkg --config build/pkg.json csgo-hud.js # --debug
