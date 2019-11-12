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
		try{
			if(accessType !== 'Kitchen Staff Member') throw new Error('only kitchen member can see pending orders')
			const pendingOrders = await this.collection.find({pending: true}).toArray()
			return pendingOrders
		}catch(error) {
			throw Error()
		}
	}
}

module.exports = Order
