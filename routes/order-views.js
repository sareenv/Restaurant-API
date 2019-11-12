'use strict'

const Router = require('koa-router')
const router = new Router()

router.get('/neworder', async ctx => {
	await ctx.render('Orders')
})

module.exports = router
