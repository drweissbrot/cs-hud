const http = require('http')
const fs = require('fs')
const jsonBignum = require('json-bignum')

const host = '127.0.0.1'
const port = 31982

module.exports = class Server {
	constructor(win) {
		this.win = win
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
				body = jsonBignum.parse(body)

				if (body.auth.token === '7ATvXUzTfBYyMLrA') this.win.webContents.send('gsi', body)

				res.end()
			})
		})

		server.listen(port, host)
		console.info(`GSI server listening at http://${host}:${port}`)
	}
}
