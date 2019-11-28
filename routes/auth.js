'use strict'

const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const bodyParser = require('koa-bodyparser')
const router = new Router()

const Staff = require('../modules/staff')
const authDb = require('../databases/authDb')

const unauthorisedStatusCode = 401
const badRequestStatusCode = 400

router.post('/register', bodyParser(), async ctx => {
	const {username, password, name, memberType} = ctx.request.body
	const staff = new Staff(authDb.database)
	try{
		await staff.registration(username, password, name, memberType)
		return ctx.body = {registerationStatus: true, message: 'The user is saved in our system', error: false}
	}catch(error) {
		ctx.response.status = badRequestStatusCode
		ctx.body = {error: true, message: error.message}
	}
})

router.post('/login', bodyParser(), async ctx => {
	const {username, password} = ctx.request.body
	const staff = new Staff(authDb.database)
	try{
		const authResult = await staff.login(username, password)
		if(authResult === false) {
			ctx.response.status = unauthorisedStatusCode
			return ctx.body = {error: true, message: 'Wrong Credientials'}
		}
		const staffType = await staff.checkStaffStatus(username)
		const token = await jwt.sign({username: username, memberType: staffType}, 'darkSecretPrivateKey340CT')
		ctx.body = { error: false, token: token }
	}catch(error) {
		ctx.response.status = badRequestStatusCode
		ctx.body = {error: true, message: error.message}
	}
})

router.get('/getStaffInformation', async ctx => {
	const username = ctx.query.username
	const staff = new Staff(authDb.database)
	try{
		const information = await staff.getStaffInformation(username)
		ctx.body = { error: false, info: information }
	}catch(error) {
		ctx.body = {error: true, message: error.message}
	}
})

router.post('/logout', bodyParser() ,async ctx => {
	const username = ctx.request.body.username
	console.log(username)
	const staff = new Staff(authDb.database)
	try{
		const information = await staff.logoutDetailsUpdate(username)
		ctx.body = { error: false, info: information }
	}catch(error) {
		ctx.body = {error: true, message: error.message}
	}
})

module.exports = router
