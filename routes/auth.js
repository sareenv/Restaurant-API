'use strict'

const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const router = new Router()

const Staff = require('../modules/staff')
const store = require('../modules/store')


router.post('/register', koaBody, async ctx => {
	const {username, password, name, memberType} = ctx.request.body
	const staff = new Staff(store.database)
	try{
		await staff.registration(username, password, name, memberType)
		ctx.body = 'Thanks for sharing your data'
	}catch(error) {
		await ctx.render('register', {error: error})
	}
})

module.exports = router
