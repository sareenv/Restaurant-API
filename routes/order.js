'use strict'

const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const router = new Router()

const Order = require('../modules/order')
const store = require('../modules/store')
const badRequestHttpCode = 400

router.post('/order', koaBody, async ctx => {
	const {tablenumber, orderedItems} = ctx.request.body
	const order = new Order(store.database)
	try{
		const orderResult = await order.orderRegistration(tablenumber, orderedItems)
		if(orderResult === true) {
			return ctx.body = true
		}
		return ctx.body = false
	}catch(error) {
		ctx.throw(badRequestHttpCode, 'Failed to save this operation')
	}
})

module.exports = router
