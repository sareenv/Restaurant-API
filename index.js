'use strict'

const Koa = require('koa')
const app = new Koa()
const staticDir = require('koa-static')

const orderRouter = require('./routes/order-routes')
const orderViewRouter = require('./routes/order-views-router')

const defaultPort = 8080
const port = process.env.PORT || defaultPort

const views = require('koa-views')

app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))
app.use(staticDir('public'))


app.use(orderViewRouter.routes())
app.use(orderRouter.routes())

app.listen(port)
