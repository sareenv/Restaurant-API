'use strict'

const Koa = require('koa')
const session = require('koa-session')
const staticDir = require('koa-static')

const app = new Koa()
const orderRouter = require('../routes/order')


<<<<<<< HEAD:service/order.js
const defaultPort = 8989
=======
const authRouter = require('./routes/auth')


const defaultPort = 8888
>>>>>>> feature/authentication:index.js
const port = process.env.PORT || defaultPort

const views = require('koa-views')
app.keys = ['covsecret']
app.use(session(app))

app.use(views(`${__dirname}/../views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))
app.use(staticDir('public'))

<<<<<<< HEAD:service/order.js
app.use(orderRouter.routes())
<<<<<<< HEAD
app.use(orderViewRouter.routes())

=======
app.use(authRouter.routes())
>>>>>>> feature/authentication:index.js
=======
>>>>>>> feature/order
app.listen(port)
