'use strict'

const {checkUndefinedValues, checkMissingValues, checkPrice} = require('../Helpers/checker')
const bcrypt = require('bcrypt-promise')

class Admin {
	constructor(database) {
		this.database = database
		this.menuCollection = database.collection('Menu')
		this.adminLoginCollection = database.collection('AdminLogin')
	}

	checkMissingDetails(itemName, itemDescription) {
		if(itemName === undefined || itemDescription === undefined) return false
		if(itemName.length <= 0 || itemDescription.length <= 0) return false
		return true
	}

	async checkExistingMenuItem(itemName) {
		const menuItem = await this.menuCollection.findOne({itemName})
		if(menuItem !== null) return true
		return false
	}

	async registerMenuItem(itemName, itemPrice, itemDescription, ingredients) {
		if(this.checkMissingDetails(itemName, itemDescription) === false) throw new Error('Missing details')
		if(checkPrice(itemPrice) === false) throw new Error('invalid price')
		const existingItem = await this.checkExistingMenuItem(itemName)
		if (existingItem === true) throw new Error('item already exist in system')
		await this.menuCollection.insertOne({itemName, itemPrice, itemDescription, ingredients})
		return true
	}

	async fetchMenuItems() {
		const menuItems = await this.menuCollection.find({}).toArray()
		return menuItems
	}

	async updateMenuItem(id, itemName, itemPrice) {
		const undefinedChecks = checkUndefinedValues(id, itemName, itemPrice)
		if(undefinedChecks === true) throw new Error('undefined details')
		const missingChecks = checkMissingValues(id, itemName)
		if(missingChecks === true) throw new Error('missing details')
		const checkitemPrice = checkPrice(itemPrice)
		if(checkitemPrice === false) throw new Error('Invalid Ammount')
		const existingCheck = await this.menuCollection.findOne({_id: id})
		if(existingCheck === null) throw new Error('Menu Item doesnot exist')
		await this.menuCollection.findOneAndUpdate( {_id: id}, {$set: {itemName: itemName, itemPrice: itemPrice}})
		return true
	}

	async adminLogin(username, password) {
		const undefinedChecks = checkUndefinedValues(username, password)
		if(undefinedChecks === true) throw new Error('undefined credentials')
		const missingChecks = checkMissingValues(username, password)
		if(missingChecks === true) throw new Error('missing details')
		const admin = await this.adminLoginCollection.findOne({username: username})
		if(admin === null) throw new Error('admin username not found')
		const compareHash = bcrypt.compare(password, admin.password)
		return compareHash
	}

}

module.exports = Admin
