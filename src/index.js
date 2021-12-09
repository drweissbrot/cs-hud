const { app, BrowserWindow, dialog, globalShortcut, ipcMain, session } = require('electron')
const path = require('path')

const Server = require('./server')

// used to be required for transparent windows, apparently not anymore, but keeping it for reference
// app.commandLine.appendSwitch('disable-gpu')

// handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) app.quit()

let mainWindow, configWindow, server

const registerShortcutToImpulse = (keys, impulse) => {
	globalShortcut.unregister(keys)

	globalShortcut.register(keys, () => {
		console.info('shortcut pressed', keys, 'sending impulse', impulse)
		mainWindow.webContents.send('impulse', impulse)
	})
}

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
			preload: MAIN_PRELOAD_WEBPACK_ENTRY,
		},
	})

	mainWindow.on('closed', () => app.quit())
	mainWindow.setIgnoreMouseEvents(true)
	mainWindow.loadURL(MAIN_WEBPACK_ENTRY + '#hud')

	registerShortcutToImpulse('F5', 'playPreMatchIntro')
	registerShortcutToImpulse('Shift+F5', 'cancelPreMatchIntro')

	registerShortcutToImpulse('F6', 'playPostMatchOutro')
	registerShortcutToImpulse('Shift+F6', 'cancelPostMatchOutro')

	registerShortcutToImpulse('F7', 'playTacticalTimeoutMusic')
	registerShortcutToImpulse('Shift+F7', 'cancelTacticalTimeoutMusic')

	registerShortcutToImpulse('F8', 'recalculateAdr')

	configWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			preload: MAIN_PRELOAD_WEBPACK_ENTRY,
		},
	})

	configWindow.on('closed', () => app.quit())
	configWindow.loadURL(MAIN_WEBPACK_ENTRY + '#config')

	ipcMain.on('config', (event, message) => mainWindow.webContents.send('config', message))
	ipcMain.on('showOpenFileDialog', async (event, message) => {
		const response = await dialog.showOpenDialog(configWindow, message.options)

		configWindow.webContents.send('openFileDialogResponse', {
			response,
			id: message.id,
		})
	})

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
				'Content-Security-Policy': ['default-src blob: data: https: \'unsafe-eval\' \'self\''],
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

app.on('will-quit', () => {
	globalShortcut.unregisterAll()
})
