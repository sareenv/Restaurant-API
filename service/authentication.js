'use strict'

const Koa = require('koa')

const app = new Koa()
const authRouter = require('../routes/auth')

const defaultPort = 8888
const port = process.env.PORT || defaultPort

app.use(authRouter.routes())
app.listen(port)
