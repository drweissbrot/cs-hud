const { app, BrowserWindow } = require('electron')

app.on('ready', () => {
	const browserWindow = new BrowserWindow({
		autoHideMenuBar: true,
		backgroundColor: '#212121',
		width: 1280,
		height: 720,
	})

	browserWindow.loadURL(`http://${process.env.HOST || 'localhost'}:${process.env.PORT || 31982}/radar`)
	browserWindow.on('closed', () => app.quit())
})

app.on('window-all-closed', () => {
	app.quit()
})
