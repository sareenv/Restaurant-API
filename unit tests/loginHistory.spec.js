'use strict'

const {MongoClient} = require('mongodb')
const Staff = require('../modules/staff')

jest.setTimeout(30000)
let connection
let db
beforeAll(async() => {
	connection = await MongoClient.connect(global.__MONGO_URI__, {
		useUnifiedTopology: true,
	})
	db = await connection.db(global.__MONGO_DB_NAME__)
})

describe('login History', () => {

	afterAll(async() => {
		await connection.close()
		await db.close()
	})

	test('undefined details', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.loginHistory(undefined)
		await expect(operation).rejects.toThrow(Error('undefined member Id'))
		done()
	})

	test('missing details', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.loginHistory('')
		await expect(operation).rejects.toThrow(Error('missing member Id'))
		done()
	})

	test('Invalid Staff Id', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.loginHistory('6787887')
		await expect(operation).rejects.toThrow(Error('member cannot be verified'))
		done()
	})

})
