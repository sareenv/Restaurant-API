/* eslint-disable complexity */

'use strict'

const bcrypt = require('bcrypt-promise')
const hashRounds = 10
const minPasswordLength = 5

class Staff {
	constructor(database) {
		this.database = database
		this.collection = this.database.collection('Staff')
	}

	async registration(username, password, name, memberType) {
		const memberTypes = ['Waiting Staff Member', 'Kitchen Staff Member']
		if(username === undefined || password === undefined || name === undefined) throw Error('missing details')
		if(password.length < minPasswordLength) throw Error('Password is short')
		if(memberTypes.indexOf(memberType) === -1) throw Error('Invalid member type')
		const existingUser = await this.collection.findOne({username})
		if(existingUser !== null) throw Error('username already exist')
		try{
			const hashedPassword = await bcrypt.hash(password, hashRounds)
			await this.collection.insertOne({username, hashedPassword, name, memberType})
			return true
		}catch(error) {
			throw Error()
		}
	}

	async login(username, password) {
		if(username === undefined || password === undefined) throw Error('Missing details')
		const user = await this.collection.findOne({username})
		if(user === null) throw Error('No user found')
		try{
			const result = await bcrypt.compare(password, user.hashedPassword)
			return result
		}catch(error) {
			throw Error(error)
		}
	}
}

module.exports = Staff


