
'use strict'

const bcrypt = require('bcrypt-promise')
const hashRounds = 10
const minPasswordLength = 5
const {checkUndefinedValues, checkMissingValues} = require('../Helpers/checker')

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
		const authHistory = []
		await this.collection.insertOne({username, hashedPassword, name, memberType, authHistory})
		return true
	}

	async login(username, password) {
		if(username === undefined || password === undefined) throw Error('Missing details')
		const user = await this.collection.findOne({username})
		if(user === null) throw Error('No user found')
		const result = await bcrypt.compare(password, user.hashedPassword)
		const loginTime = new Date().toLocaleTimeString()
		const loginDate = new Date().toLocaleDateString()
		const loginDetails = { loginTime, loginDate }
		const authHistory = {loginDetails}
		this.collection.findOneAndUpdate({_id: user._id}, {$push: {authHistory: authHistory}})
		return result
	}

	async loginHistory(username) {
		const undefinedChecks = checkUndefinedValues(username)
		const missingChecks = checkMissingValues(username)
		if(undefinedChecks === true) throw new Error('undefined member Id')
		if(missingChecks === true) throw new Error('missing member Id')
		const member = await this.collection.findOne({username: username})
		if(member === null) throw new Error('member cannot be verified')
		const loginHistory = member.authHistory
		return loginHistory
	}

	async pushlogoutDetails(member) {
		for(let i = 0; i< member.authHistory.length; i++) {
			if(member.authHistory[i].logoutDetails === undefined) {
				const logoutTime = new Date().toLocaleTimeString()
				const logoutDate = new Date().toLocaleDateString()
				const updateValue = { logoutTime, logoutDate}
				const value = 'authHistory.'+ `${i}`
				const query = {}
				query[value] = {loginDetails: member.authHistory[i].loginDetails ,logoutDetails: updateValue}
				await this.collection.findOneAndUpdate({_id: member._id}, {$set: query})
				return true
			}
		}
		return false
	}

	async logoutDetailsUpdate(username) {
		const undefinedChecks = checkUndefinedValues(username)
		const missingChecks = checkMissingValues(username)
		if(undefinedChecks === true) throw new Error('undefined member Id')
		if(missingChecks === true) throw new Error('missing member Id')
		const member = await this.collection.findOne({username: username})
		if(member === null) throw new Error('member cannot be verified')
		const logoutDetailsResult = await this.pushlogoutDetails(member)
		return logoutDetailsResult
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
