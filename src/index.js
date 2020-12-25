const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const Server = require('./server')

// apparently required for transparent windows
app.commandLine.appendSwitch('disable-gpu')

// handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) app.quit()

let mainWindow, configWindow, server

const createWindow = () => {
	if (mainWindow || configWindow || server) return

	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		alwaysOnTop: true,
		transparent: true,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			preload: MAIN_PRELOAD_WEBPACK_ENTRY,
		},
	})

	mainWindow.on('closed', () => mainWindow = null)

	mainWindow.webContents.openDevTools({ mode:'undocked' })
	mainWindow.loadURL(MAIN_WEBPACK_ENTRY + '#hud')

	configWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
			preload: MAIN_PRELOAD_WEBPACK_ENTRY,
		},
	})

	configWindow.on('closed', () => configWindow = null)
	configWindow.loadURL(MAIN_WEBPACK_ENTRY + '#config')

	ipcMain.on('seriesData', (event, message) => mainWindow.webContents.send('seriesData', message))

	server = new Server(mainWindow, configWindow).run()
}

// creating the window after a delay is apparently required for transparent windows (due to an electron bug i guess?)
app.on('ready', () => setTimeout(createWindow, 100))

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
