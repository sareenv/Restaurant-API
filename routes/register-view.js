'use strict'

const Router = require('koa-router')
const router = new Router()

router.get('/register', async ctx => {
	await ctx.render('register')
})

module.exports = router
