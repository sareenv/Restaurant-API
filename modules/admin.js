'use strict'

class Admin {
	constructor(database) {
		this.database = database
		this.menuCollection = database.collection('Menu')
	}

	checkMissingDetails(itemName, itemDescription) {
		if(itemName === undefined || itemDescription === undefined) return false
		if(itemName.length <= 0 || itemDescription.length <= 0) return false
		return true
	}

	checkPriceDetails(itemPrice) {
		if(itemPrice <= 0) return false
		if(typeof itemPrice !== 'number') return false
		return true
	}

	async checkExistingMenuItem(itemName) {
		const menuItem = await this.menuCollection.findOne({itemName})
		if(menuItem !== null) return true
		return false
	}

	async registerMenuItem(itemName, itemPrice, itemDescription, ingredients) {
		if(this.checkMissingDetails(itemName, itemDescription) === false) throw new Error('Missing details')
		if(this.checkPriceDetails(itemPrice) === false) throw new Error('invalid price')
		const existingItem = await this.checkExistingMenuItem(itemName)
		if (existingItem === true) throw new Error('item already exist in system')
		await this.menuCollection.insertOne({itemName, itemPrice, itemDescription, ingredients})
		return true
	}

	async fetchMenuItems() {
		try{
			const menuItems = await this.menuCollection.find({}).toArray()
			return menuItems
		}catch(error) {
			throw new Error()
		}
	}
}

module.exports = Admin
