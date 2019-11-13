'use strict'

const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const bodyParser = require('koa-bodyparser')
const router = new Router()

const Staff = require('../modules/staff')
const store = require('../modules/store')
const unauthorisedStatusCode = 401

router.post('/register', bodyParser(), async ctx => {
	const {username, password, name, memberType} = ctx.request.body
	const staff = new Staff(store.database)
	try{
		await staff.registration(username, password, name, memberType)
		return ctx.body = true
	}catch(error) {
		await ctx.render('register', {error: error})
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
