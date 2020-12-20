const { app, BrowserWindow } = require('electron')
const path = require('path')

const Server = require('./server')

// apparently required for transparent windows
app.commandLine.appendSwitch('disable-gpu')

// handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) app.quit()

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		transparent: true,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			preload: MAIN_PRELOAD_WEBPACK_ENTRY,
		},
	})

	mainWindow.loadURL(MAIN_WEBPACK_ENTRY)
	mainWindow.webContents.openDevTools({ mode:'undocked' })

	new Server(mainWindow).run()
}

// creating the window after a delay is apparently required for transparent windows (due to an electron bug i guess?)
app.on('ready', () => setTimeout(createWindow, 100))

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
