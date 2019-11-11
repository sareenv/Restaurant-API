'use strict'

const Router = require('koa-router')
const router = new Router()

router.get('/', async ctx => {
	await ctx.render('register')
})

router.get('/login', async ctx => {
	await ctx.render('login')
})

router.get('/welcome', async ctx => {
	if (ctx.session.authorised === null) {
		ctx.redirect('/login')
	}
	await ctx.render('welcome', {user: ctx.session.staff})
})

module.exports = router
