const Koa = requrie('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

const port = process.env.PORT || 8080


app.use(router.routes())
app.listen(port)