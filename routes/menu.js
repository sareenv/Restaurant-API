'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const Admin = require('../modules/admin')

const adminDb = require('../databases/adminDb')

const router = new Router()

router.post('/addMenuListing', bodyParser(), async ctx => {
	const {itemName, itemPrice, description, ingredients} = ctx.request.body
	const admin = new Admin(adminDb.database)
	try{
		const price = parseInt(itemPrice)
		await admin.registerMenuItem(itemName, price, description, ingredients)
		return ctx.body = {error: false, message: 'Thanks the product has been saved.' }
	}catch(error) {
		return ctx.body = {error: true, message: error.message}
	}
})

router.get('/fetchmenuItems', async ctx => {
	// fetch the stuff from the modules.
	// const admin = new Admin(adminDb.database)
	ctx.body = {items: [{name: 'Fish and chips', price: 20}]}
})

module.exports = router
