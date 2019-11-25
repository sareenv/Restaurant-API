'use strict'

const {checkUndefinedValues} = require('../Helpers/checker')

class Order {
	constructor(database) {
		this.database = database
		this.collection = this.database.collection('Orders')
	}


	async orderRegistration(tablenumber, orderedItems) {
		const undefinedChecks = checkUndefinedValues(tablenumber, orderedItems)
		if(undefinedChecks === true) throw new Error('undefined details')
		if(isNaN(parseInt(tablenumber))) throw new Error('Invalid table number')
		const date = new Date()
		const time = date.toLocaleTimeString()
		const curDate = date.toLocaleDateString()
		const details = {tablenumber: tablenumber, orderedItems: orderedItems, pending: true, time: time, date: curDate}
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
