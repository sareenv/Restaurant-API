'use strict'

class Order {
	constructor(database) {
		this.database = database
		this.collection = database.collection('Orders')
	}

	async orderRegistration(tablenumber, orderedItems) {
		if (tablenumber === undefined) throw new Error('missing table number')
		if (orderedItems === undefined) throw new Error('missing orderedItems')
		if(isNaN(parseInt(tablenumber))) throw new Error('Invalid table number')
		try {
			const details = {tablenumber: tablenumber, orderedItems: orderedItems, pending: true}
			await this.collection.insertOne(details)
			return true
		}catch(error) {
			throw error
		}
	}

	async pendingOrders(accessType) {
		if(accessType !== 'Kitchen Staff Member') throw new Error('only kitchen member can see pending orders')
		try{
			const pendingOrders = await this.collection.find({pending: true}).toArray()
			return pendingOrders
		}catch(error) {
			console.log(error)
			throw Error()
		}
	}

	async collectionReadyOrders(orderId, accessType) {
		if(accessType !== 'Kitchen Staff Member') throw new Error('Only, Kitch staff can call for collection')
		if(orderId === undefined || orderId.length < 1) throw new Error('id cannot be null')
		const order = await this.collection.findOne({_id: orderId})
		if (order !== null) {
			await order.updateOne({_id: orderId}, {$set: {pending: false}})
			return true
		}
		return false
	}
}

module.exports = Order
