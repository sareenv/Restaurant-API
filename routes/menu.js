'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const Admin = require('../modules/admin')

const adminDb = require('../databases/adminDb')

const badResponseHttpCode = 400
const router = new Router()

router.post('/addMenuListing', bodyParser(), async ctx => {
	const {itemName, itemPrice, description, ingredients} = ctx.request.body
	const admin = new Admin(adminDb.database)
	try{
		const price = parseInt(itemPrice)
		await admin.registerMenuItem(itemName, price, description, ingredients)
		return ctx.body = {error: false, message: 'Thanks the product has been saved.' }
	}catch(error) {
		ctx.response.status = badResponseHttpCode
		return ctx.body = {error: true, message: error.message}
	}
})

router.get('/fetchmenuItems', async ctx => {
	try{
		const admin = new Admin(adminDb.database)
		const items = await admin.fetchMenuItems()
		ctx.body = {error: false, menuItems: items}
	}catch(error) {
		ctx.response.status = badResponseHttpCode
		return ctx.body = {error: true, message: error.message}
	}
})

router.put('/updateMenuDetails/:id', async ctx => {
	try{
		const id = ctx.params.id
		const { itemName, itemPrice } = ctx.query.itemName
		const admin = new Admin(adminDb.database)
		await admin.updateMenuItem(id, itemName, itemPrice)
		ctx.body = {error: false, message: `Details are added for  id ${id}`}
	}catch(error) {
		ctx.response.status = badResponseHttpCode
		return ctx.body = {error: true, message: error.message}
	}
})

module.exports = router
