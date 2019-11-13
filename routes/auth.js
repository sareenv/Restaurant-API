'use strict'

const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const router = new Router()

const Staff = require('../modules/staff')
const store = require('../modules/store')


router.post('/register', koaBody, async ctx => {
	const {username, password, name, memberType} = ctx.request.body
	const staff = new Staff(store.database)
	try{
		await staff.registration(username, password, name, memberType)
		return ctx.redirect('/')
	}catch(error) {
		await ctx.render('register', {error: error})
	}
})

router.post('/login', koaBody, async ctx => {
	const {username, password} = ctx.request.body
	const staff = new Staff(store.database)
	try{
		const authResult = await staff.login(username, password)
		if(authResult === false) {
			return await ctx.render('login', {error: 'Authentication Failed! Wrong Credentials'})
		}
		const staffType = await staff.memberType(username)
		const token = await jwt.sign({username: username, memberType: staffType}, 'darkSecretPrivateKey340CT')
		ctx.body = { token }
	}catch(error) {
		await ctx.render('login', {error: error})
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/login')
})

module.exports = router
