'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const router = new Router()

router.post('/addMenuListing', bodyParser(), async ctx => {
	const {itemName, itemPrice, description, ingredients} = ctx.request.body
	console.log(itemName, itemPrice, description, ingredients)
	ctx.body = {info: 'Thanks for sharing the menu item information' }
})

module.exports = router
