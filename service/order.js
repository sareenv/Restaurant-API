'use strict'

const Koa = require('koa')
const session = require('koa-session')

const app = new Koa()
const orderRouter = require('../routes/order')

const defaultPort = 8989
const port = process.env.PORT || defaultPort

app.keys = ['covsecret']
app.use(session(app))

app.use(orderRouter.routes())
app.listen(port)
