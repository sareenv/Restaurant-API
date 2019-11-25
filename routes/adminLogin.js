'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const jwt = require('jsonwebtoken')

const router = new Router()
const unauthorisedStatusCode = 401
const Admin = require('../modules/admin')
const adminDb = require('../databases/adminDb')

router.post('/adminLogin', bodyParser(), async ctx => {
	const {username, password} = ctx.request.body
	const admin = new Admin(adminDb.database)
	try{
		const result = await admin.adminLogin(username, password)
		const secret = 'darkSecret340Admin'
		const token = await jwt.sign({ exp: 1800, data: {username: username, memberType: 'admin'} }, secret)
		if(result === true) return ctx.body = {error: false, token: token}
		ctx.response.status = unauthorisedStatusCode
		return ctx.body = {error: true, message: 'Error validating credentials'}
	}catch(error) {
		ctx.response.status = unauthorisedStatusCode
		return ctx.body = {error: true, message: 'Error validating credentials'}
	}
})

module.exports = router
