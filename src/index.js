const { app, BrowserWindow, ipcMain, session } = require('electron')
const path = require('path')

const Server = require('./server')

// used to be required for transparent windows, apparently not anymore, but keeping it for reference
// app.commandLine.appendSwitch('disable-gpu')

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
		fullscreen: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
			preload: MAIN_PRELOAD_WEBPACK_ENTRY,
		},
	})

	mainWindow.on('closed', (e) => e.preventDefault())
	mainWindow.setIgnoreMouseEvents(true)
	mainWindow.loadURL(MAIN_WEBPACK_ENTRY + '#hud')

	configWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
			preload: MAIN_PRELOAD_WEBPACK_ENTRY,
		},
	})

	configWindow.on('closed', (e) => e.preventDefault())
	configWindow.loadURL(MAIN_WEBPACK_ENTRY + '#config')

	ipcMain.on('seriesData', (event, message) => mainWindow.webContents.send('seriesData', message))

	server = new Server(mainWindow, configWindow).run()

	setInterval(() => mainWindow.showInactive(), 250)
}

app.on('ready', () => {
	// creating the window after a delay is apparently required for transparent windows (due to an electron bug i guess?)
	setTimeout(createWindow, 100)

	session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
		callback({
			responseHeaders: {
				...details.responseHeaders,
				'Content-Security-Policy': ['default-src data: https: \'unsafe-eval\' \'self\''],
			},
		})
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
