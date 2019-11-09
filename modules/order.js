'use strict'

class Order {
	constructor(database) {
		this.database = database
	}

	async orderRegistration(tablenumber, orderedItems) {
		if (tablenumber === undefined) throw new Error('missing table number')
		if (orderedItems === undefined) throw new Error('missing orderedItems')
		if(isNaN(parseInt(tablenumber))) throw new Error('Invalid type for table number')
		try {
			// eslint-disable-next-line max-len
			await this.database.collection('Orders').insertOne({tablenumber: tablenumber, orderedItems: orderedItems, pending: true})
			return true
		}catch(error) {
			throw error
		}
	}

}

module.exports = Order
