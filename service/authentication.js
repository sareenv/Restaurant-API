'use strict'

const Koa = require('koa')

const app = new Koa()
const authRouter = require('../routes/auth')
<<<<<<< HEAD
=======

>>>>>>> feature/order

const defaultPort = 8888
const port = process.env.PORT || defaultPort

app.use(authRouter.routes())
<<<<<<< HEAD
=======


>>>>>>> feature/order
app.listen(port)
