'use strict'

const Router = require('koa-router')
const Staff = require('../modules/staff')
const authDb = require('../databases/authDb')
const router = new Router()

router.get('/loginHistory/:username', async ctx => {
	const staff = new Staff(authDb.database)
	try {
		const loginHistoryResult = await staff.loginHistory(ctx.params.username)
	    ctx.body = {error: false, message: loginHistoryResult}
	}catch(error) {
		ctx.body = {error: true, message: error.message}
	}

})

module.exports = router
