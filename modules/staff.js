
'use strict'

const bcrypt = require('bcrypt-promise')
const hashRounds = 10
const minPasswordLength = 5


class Staff {
	constructor(database) {
		this.database = database
		this.collection = database.collection('Staff')
	}


	async missingDetails(username, password, name) {
		if(username === undefined || password === undefined || name === undefined) {
			return true
		}
		return false
	}


	async registration(username, password, name, memberType) {
		const memberTypes = ['Waiting Staff Member', 'Kitchen Staff Member']
		const missingDetails = await this.missingDetails(username, password, name)
		if(missingDetails === true) throw Error('missing details')
		if(password.length < minPasswordLength) throw Error('Password is short')
		if(memberTypes.indexOf(memberType) === -1) throw Error('Invalid member type')
		const existingUser = await this.collection.findOne({username: username})
		if(existingUser !== null) throw Error('username already exist')
		const hashedPassword = await bcrypt.hash(password, hashRounds)
		await this.collection.insertOne({username, hashedPassword, name, memberType})
		return true
	}

	async login(username, password) {
		if(username === undefined || password === undefined) throw Error('Missing details')
		const user = await this.collection.findOne({username})
		if(user === null) throw Error('No user found')
		const result = await bcrypt.compare(password, user.hashedPassword)
		return result
	}

	async getStaffInformation(username) {
		if(username === undefined || username === '') throw Error('missing username')
		const staff = await this.collection.findOne({username: username})
		if(staff === null) throw Error('No staff found in system with this details')
		const details = {username: staff.username, name: staff.name, memberType: staff.memberType}
		return details
	}

	async checkStaffStatus(username) {
		if(username.length <= 0 || username.length === undefined) throw new Error('missing username')
		const member = await this.collection.findOne({username})
		if (member === null) throw new Error('No staff member')
		return member.memberType
	}
}

module.exports = Staff
