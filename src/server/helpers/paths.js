import { dirname } from 'path'
import { fileURLToPath } from 'url'

// not foolproof, but: pkg can only package commonjs files as exectuables, this project normally does not use commonjs,
// and __dirname is only defined in commonjs -- so, assuming that none of these assumptions change, this works for now
const runningInBinary = typeof __dirname !== 'undefined'

// paths to project root, /path/to/cs-hud, the directory that contains `src`, `package.json`, `node_modules`, etc.
// builtinRootDirectory should be used for files that are part of this repository, i.e. "built in to the application"
export const builtinRootDirectory = runningInBinary
	? __dirname
	: dirname(fileURLToPath(import.meta.url + '/../../..'))

// customRootDirectory should be used for files that the end user can see/edit, e.g. userspace and custom themes
export const customRootDirectory = runningInBinary
	? dirname(process.execPath)
	: dirname(fileURLToPath(import.meta.url + '/../../..'))

// directories
export const builtinThemesDirectory = `${builtinRootDirectory}/src/themes`
export const customThemesDirectory = runningInBinary
	? `${customRootDirectory}/cs-hud`
	: `${customRootDirectory}/src/themes`

export const userspaceDirectory = `${customThemesDirectory}/userspace`

// files
export const userspaceBombsitesPath = `${userspaceDirectory}/bombsites.json`
export const userspaceRadarsPath = `${userspaceDirectory}/radars.json`
export const userspaceSettingsPath = `${userspaceDirectory}/theme.json`
