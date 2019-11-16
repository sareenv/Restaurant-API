'use strict'

jest.setTimeout(30000)
jest.mock('../__mocks__/bcrypt-promise')
const {MongoClient} = require('mongodb')
const Staff = require('../modules/staff')


describe('Staff Details', () => {
	let connection
	let db

	beforeAll(async() => {
		connection = await MongoClient.connect(global.__MONGO_URI__, {
			useUnifiedTopology: true,
		})
		db = await connection.db(global.__MONGO_DB_NAME__)
		await db.collection('Staff').deleteMany({})
		const details = {username: 'josh', hashedPassword: 'BX56-db125', name: 'vi', memberType: 'Waiting Staff Member'}
		await db.collection('Staff').insertOne(details)
	})

	afterAll(async() => {
		await connection.close()
		await db.close()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.getStaffInformation('')
		await expect(operation).rejects.toThrow(Error('missing username'))
		done()
	})

	test('undefined username', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.getStaffInformation(undefined)
		await expect(operation).rejects.toThrow(Error('missing username'))
		done()
	})

	test('non existing username', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.getStaffInformation('kira')
		await expect(operation).rejects.toThrow(Error('No staff found in system with this details'))
		done()
	})

})
