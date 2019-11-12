'use strict'

const Koa = require('koa')
const session = require('koa-session')
const staticDir = require('koa-static')

const app = new Koa()
const authRouter = require('../routes/auth')
const authViewRouter = require('../routes/auth-view')

const defaultPort = 8888
const port = process.env.PORT || defaultPort

const views = require('koa-views')
app.keys = ['covsecret']
app.use(session(app))

app.use(views(`${__dirname}/../views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))
app.use(staticDir('public'))

app.use(authRouter.routes())
app.use(authViewRouter.routes())

app.listen(port)
