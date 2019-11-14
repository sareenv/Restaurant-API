'use strict'

const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const bodyParser = require('koa-bodyparser')
const router = new Router()

const Staff = require('../modules/staff')
const store = require('../modules/store')

const unauthorisedStatusCode = 401
const badRequestStatusCode = 400

router.post('/register', bodyParser(), async ctx => {
	const {username, password, name, memberType} = ctx.request.body
	const staff = new Staff(store.database)
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
	const staff = new Staff(store.database)
	try{
		const authResult = await staff.login(username, password)
		if(authResult === false) {
			return ctx.throw(unauthorisedStatusCode, {error: 'Details are not found in our system'})
		}
		const staffType = await staff.memberType(username)
		const token = await jwt.sign({username: username, memberType: staffType}, 'darkSecretPrivateKey340CT')
		ctx.body = { token }
	}catch(error) {
		console.log(error)
		ctx.throw(unauthorisedStatusCode, {error: error})
	}
})

module.exports = router
