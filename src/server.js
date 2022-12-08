const http = require('http')
const fs = require('fs')
const { ipcMain } = require('electron')

const host = '127.0.0.1'
const port = 31982

module.exports = class Server {
	constructor(mainWindow, configWindow) {
		this.mainWindow = mainWindow
		this.configWindow = configWindow

		this.previously = {}

		ipcMain.on('request-gsi', (event, { win }) => {
			win = (win === 'config')
				? this.configWindow
				: this.mainWindow

			for (const key in this.previously) {
				win.webContents.send('gsi', { key, value: JSON.parse(this.previously[key]) })
			}
		})
	}

	run() {
		const server = http.createServer((req, res) => {
			if (req.method !== 'POST') {
				res.writeHead(405)
				return res.end()
			}

			res.writeHead(200)

			let body = ''
			req.on('data', (data) => body += data)

			req.on('end', () => {
				body = JSON.parse(body)

				if (body.auth.token === '7ATvXUzTfBYyMLrA') {
					for (const key in body) {
						if (['added', 'auth', 'previously'].includes(key)) continue

						const stringified = JSON.stringify(body[key])
						if (this.previously[key] === stringified) continue

						this.previously[key] = stringified

						this.mainWindow.webContents.send('gsi', { key, value: body[key] })

						if (['allplayers', 'bomb', 'grenades', 'map', 'player'].includes(key)) {
							this.configWindow.webContents.send('gsi', { key, value: body[key] })
						}
					}
				}

				res.end()
			})
		})

		server.listen(port, host)
		console.info(`GSI server listening at http://${host}:${port}`)
	}
}
