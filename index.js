'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

const defaultPort = 8080
const port = process.env.PORT || defaultPort


app.use(router.routes())
app.listen(port)
