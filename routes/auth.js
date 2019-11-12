'use strict'

const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const router = new Router()

const Staff = require('../modules/staff')
const authDb = require('../databases/authDb')


router.post('/register', koaBody, async ctx => {
	const {username, password, name, memberType} = ctx.request.body
	const staff = new Staff(authDb.database)
	try{
		await staff.registration(username, password, name, memberType)
		ctx.redirect('/login')
	}catch(error) {
		await ctx.render('register', {error: error})
	}
})

router.post('/login', koaBody, async ctx => {
	const {username, password} = ctx.request.body
	const staff = new Staff(authDb.database)
	try{
		const authResult = await staff.login(username, password)
		if(authResult === false) {
			return await ctx.render('login', {error: 'Authentication Failed! Wrong Credentials'})
		}

		ctx.session = {authorised: true, staff: username}
		ctx.redirect('/welcome')
	}catch(error) {
		await ctx.render('login', {error: error})
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/login')
})

module.exports = router
