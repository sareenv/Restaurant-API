'use strict'

const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const router = new Router()

const Order = require('../modules/order')
const ordersDb = require('../databases/orderdb')
const badRequestHttpCode = 400

router.post('/order', koaBody, async ctx => {
	const {tablenumber, orderedItems} = ctx.request.body
	const order = new Order(ordersDb.database)
	try{
		const orderResult = await order.orderRegistration(tablenumber, orderedItems)
		if(orderResult === true) {
			return ctx.redirect('/neworder')
		}
		return ctx.body = 'Sorry the order was not registered'
	}catch(error) {
		console.log(error)
		ctx.throw(badRequestHttpCode, 'Failed to save this operation')
	}
})

module.exports = router
