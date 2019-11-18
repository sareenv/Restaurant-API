'use strict'

class Order {
	constructor(database) {
		this.database = database
		this.collection = this.database.collection('Orders')
	}

	async orderRegistration(tablenumber, orderedItems) {
		if (tablenumber === undefined) throw new Error('missing table number')
		if (orderedItems === undefined) throw new Error('missing orderedItems')
		if(isNaN(parseInt(tablenumber))) throw new Error('Invalid table number')
		const currentTime = new Date().toLocaleTimeString()
		const details = {tablenumber: tablenumber, orderedItems: orderedItems, pending: true, time: currentTime}
		const newOrder = await this.collection.insertOne(details)
		return {orderRegistered: true, orderId: newOrder._id}
	}

	async pendingOrders(accessType) {
		if(accessType !== 'Kitchen Staff Member') throw new Error('only kitchen member can see pending orders')
		const pendingOrders = await this.collection.find({pending: true}).toArray()
		return pendingOrders
	}

	async collectionReadyOrders(orderId, accessType) {
		if(accessType !== 'Kitchen Staff Member') throw new Error('Only, Kitchen staff can call for collection')
		if(orderId === undefined || orderId.length < 1) throw new Error('Id cannot be missing or empty')
		const order = await this.collection.findOne({_id: orderId})
		if (order !== null) {
			await this.collection.findOneAndUpdate( {_id: orderId}, {$set: {pending: false}})
			return true
		}
		return false
	}

	async readyOrders(accessType) {
		if(accessType !== 'Waiting Staff Member') throw new Error('Only, Waiting staff can call for collection')
		const orders = await this.collection.find({pending: false}).toArray()
		if(orders.length > 0) return orders
		return false
	}
}

module.exports = Order
