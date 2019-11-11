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
<<<<<<< HEAD
			const orderDetails = {tablenumber: tablenumber, orderedItems: orderedItems, pending: true}
			await this.database.collection('Orders').insertOne(orderDetails)
=======
			const details = {tablenumber: tablenumber, orderedItems: orderedItems, pending: true}
			await this.collection('Orders').insertOne(details)
>>>>>>> feature/order
			return true
		}catch(error) {
			throw error
		}
	}
}

module.exports = Order
