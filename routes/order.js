'use strict'

const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const router = new Router()

const Order = require('../modules/order')
const ordersDb = require('../databases/orderdb')

const badRequestHttpCode = 400
const okHttpCode = 200

const checkwaitingStaffMiddleware = require('../middleware/waitingStaff')
const checkKitchenStaffMiddleware = require('../middleware/kitchenStaff')

router.post('/order', koaBody, checkwaitingStaffMiddleware, async ctx => {
	const {tablenumber, orderedItems} = ctx.request.body
	const order = new Order(ordersDb.database)
	try{
		const orderResult = await order.orderRegistration(tablenumber, orderedItems)
		if(orderResult.orderRegistered === true) {
			ctx.status = okHttpCode
			return ctx.body = {message: 'Order is register successfully', error: false}
		}
		ctx.status = badRequestHttpCode
		return ctx.body = {error: true, message: 'Cannot make this order'}
	}catch(error) {
		ctx.status = okHttpCode
		ctx.body = {error: true, message: error}
	}
})

router.post('/pendingOrders', checkKitchenStaffMiddleware, async ctx => {
	try{
		const order = new Order(ordersDb.database)
		const orders = await order.pendingOrders('Kitchen Staff Member')
		ctx.body = {pendingOrders: orders, error: false}
	}catch(error) {
		ctx.body = {error: true, message: error}
	}
})

router.post('/orderCollection', koaBody, checkKitchenStaffMiddleware, async ctx => {
	const orderId = ctx.request.body.orderId
	const accessType = 'Kitchen Staff Member'
	const order = new Order(ordersDb.database)
	try{
		const result = await order.collectionReadyOrders(orderId, accessType)
		if(result === true) {
			return ctx.redirect('/pendingOrders')
		}
		return ctx.redirect('error', {error: 'Order collection call failed'})
	}catch(error) {
		console.log(error)
		return ctx.redirect('error', {error: error})
	}
})

module.exports = router
