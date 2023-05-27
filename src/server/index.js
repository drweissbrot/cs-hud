import http from 'http'

import bodyParser from 'koa-bodyparser'
import Koa from 'koa'
import KoaRouter from 'koa-router'

import { registerConfigRoutes } from './config.js'
import { registerDependencyRoutes } from './dependencies.js'
import { registerGsiRoutes } from './gsi.js'
import { registerHudRoutes } from './hud.js'
import { Websocket } from './websocket.js'

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 31982

const app = new Koa()
const server = http.createServer(app.callback())

app.use(bodyParser({
	strict: true,
	enableTypes: ['json'],
}))

const websocket = new Websocket(server)

// register routes
const router = new KoaRouter()
registerConfigRoutes(router)
registerDependencyRoutes(router)
registerGsiRoutes(router, websocket)
registerHudRoutes(router)

// start server
app.use(router.routes())
app.use(router.allowedMethods())

server.listen(port, host)
console.info(`CS:GO HUD active at http://${host}:${port}. Press Ctrl+C to quit.`)
