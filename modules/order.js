'use strict'

const {checkUndefinedValues, checkMissingValues} = require('../Helpers/checker')

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
		const undefinedChecks = checkUndefinedValues(accessType)
		if(undefinedChecks === true) throw new Error('undefined access Type')
		const missingChecks = checkMissingValues(accessType)
		if(missingChecks === true) throw new Error('missing access Type')
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
		const undefinedChecks = checkUndefinedValues(accessType)
		const missingChecks = checkMissingValues(accessType)
		if(undefinedChecks === true) throw new Error('undefined accessType')
		if(missingChecks === true) throw new Error('missing accessType')
		if(accessType !== 'Waiting Staff Member') throw new Error('Only, Waiting staff can call for collection')
		const orders = await this.collection.find({pending: false}).toArray()
		if(orders.length > 0) return orders
		return false
	}

	async fetchAllOrders(accessType) {
		const undefinedChecks = checkUndefinedValues(accessType)
		const missingChecks = checkMissingValues(accessType)
		const date = new Date().toLocaleDateString()
		if(undefinedChecks === true) throw new Error('undefined accessType')
		if(missingChecks === true) throw new Error('missing admin Id')
		if(accessType !== 'admin') throw new Error('Only, Admin can access this resource')
		const orders = await this.collection.find({date: date}).toArray()
		return orders
	}
}

module.exports = Order
