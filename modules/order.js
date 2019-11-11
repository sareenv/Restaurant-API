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
			await this.collection('Orders').insertOne(details)
			return true
		}catch(error) {
			throw error
		}
	}

}

module.exports = Order
