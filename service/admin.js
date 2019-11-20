'use strict'

const Koa = require('koa')
const session = require('koa-session')

const menuRoutes = require('../routes/menu')
const app = new Koa()

app.keys = ['covsecret']
app.use(session(app))

const defaultPort = 9090
const port = process.env.PORT || defaultPort

app.use(menuRoutes.routes())

app.listen(port)
