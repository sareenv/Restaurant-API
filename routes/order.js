'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const ObjectID = require('mongodb').ObjectID
const router = new Router()

const Order = require('../modules/order')
const ordersDb = require('../databases/orderdb')

const badRequestHttpCode = 400
const okHttpCode = 200

const checkwaitingStaffMiddleware = require('../middleware/waitingStaff')
const checkKitchenStaffMiddleware = require('../middleware/kitchenStaff')
const checkAdminMiddleware = require('../middleware/checkAdmin')

router.post('/order', bodyParser(), checkwaitingStaffMiddleware, async ctx => {
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

router.post('/pendingOrders', bodyParser(), checkKitchenStaffMiddleware, async ctx => {
	try{
		const order = new Order(ordersDb.database)
		const orders = await order.pendingOrders('Kitchen Staff Member')
		ctx.body = {pendingOrders: orders, error: false}
	}catch(error) {
		ctx.body = {error: true, message: error}
	}
})

router.post('/orderCollection', bodyParser(), checkKitchenStaffMiddleware, async ctx => {
	const orderId = ObjectID(ctx.request.body.orderId)
	const accessType = 'Kitchen Staff Member'
	const order = new Order(ordersDb.database)
	try{
		const result = await order.collectionReadyOrders(orderId, accessType)
		if(result === true) {
			return ctx.body = {error: false, message: 'order collection has been called'}
		}
		return ctx.body = {error: true, message: 'order collection call is failed'}
	}catch(error) {
		return {error: true, message: error.message}
	}
})

router.get('/readyOrders', async ctx => {
	const order = new Order(ordersDb.database)
	const readyOrders = await order.readyOrders()
	ctx.body = readyOrders
})

router.get('/fetchAllOrders', checkAdminMiddleware, async ctx => {
	const order = new Order(ordersDb.database)
	try{
		const orders = await order.fetchAllOrders('admin')
		ctx.body = {error: false, orders: orders}
	}catch(error) {
		ctx.body = {error: true, message: error.message}
	}
})

module.exports = router
