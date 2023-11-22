const { app, BrowserWindow } = require('electron')

app.on('ready', () => {
	const browserWindow = new BrowserWindow({
		alwaysOnTop: true,
		transparent: true,
		frame: false,
		fullscreen: true,
	})

	browserWindow.setIgnoreMouseEvents(true)
	browserWindow.loadURL(`http://${process.env.HOST || 'localhost'}:${process.env.PORT || 31982}/hud?transparent&corners`)
	browserWindow.on('closed', () => app.quit())
})

app.on('window-all-closed', () => {
	app.quit()
})
