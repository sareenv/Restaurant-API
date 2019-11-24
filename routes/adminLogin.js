'use strict'

const Router = require('koa-router')
const jwt = require('jsonwebtoken')

const router = new Router()
const unauthorisedStatusCode = 401
const Admin = require('../modules/admin')
const adminDb = require('../databases/adminDb')

router.post('/adminLogin', async ctx => {
	const {username, password} = ctx.request.body
	const admin = new Admin(adminDb.database)
	const result = admin.adminLogin(username, password)
	const token = await jwt.sign({username: username, memberType: admin}, 'darkSecretPrivateKey340CTAdmin')
	if(result === true) return ctx.body = {error: false, token: token}
	ctx.response.status = unauthorisedStatusCode
	return ctx.body = {error: true, message: 'Error validating credentials'}
})

module.exports = router
