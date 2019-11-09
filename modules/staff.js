/* eslint-disable complexity */
'use strict'

const bcrypt = require('bcrypt-promise')
const hashRounds = 10

class Staff {
	constructor(database) {
		this.database = database
		this.collection = this.database.collection('Staff')
	}

	async registration(username, password, name) {
		const minPasswordLength = 5
		if(username === undefined || password === undefined || name === undefined) throw Error()
		if(password.length < minPasswordLength) throw Error('Password is short')
		const existingUser = await this.collection.findOne({username})
		if(existingUser !== null) throw Error('username already exist')
		try{
			const hashedPassword = await bcrypt.hash(password, hashRounds)
			await this.collection.insertOne({username, hashedPassword, name})
			return true
		}catch(error) {
			throw Error()
		}
	}
}

module.exports = Staff


