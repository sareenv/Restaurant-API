'use strict'

const Router = require('koa-router')
const router = new Router()

router.get('/loginHistory', async ctx => {
	ctx.body = {error: false, message: 'Thanks for asking for this resource'}
})

module.exports = router
