import { dirname } from 'path'
import { fileURLToPath } from 'url'

// path to project root, /path/to/csgo-hud, the directory that contains `src`, `package.json`, `node_modules`, etc.
export const rootDirectory = dirname(fileURLToPath(import.meta.url + '/../../..'))

// directories
export const themesDirectory = `${rootDirectory}/src/themes`
export const userspaceDirectory = `${themesDirectory}/userspace`

// files
export const userspaceBombsitesPath = `${userspaceDirectory}/bombsites.json`
export const userspaceRadarsPath = `${userspaceDirectory}/radars.json`
export const userspaceSettingsPath = `${userspaceDirectory}/theme.json`
