'use strict'

const {MongoClient} = require('mongodb')
const Staff = require('../modules/staff')

describe('check registration details', () => {
	let connection
	let db

	beforeAll(async() => {
		connection = await MongoClient.connect(global.__MONGO_URI__, {
			useUnifiedTopology: true,
		})
		db = await connection.db(global.__MONGO_DB_NAME__)
	})

	afterAll(async() => {
		await connection.close()
		await db.close()
	})

	test('registeration undefined username', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		await expect(staff.checkDetails(undefined, 'bxbhsxwt3-fb', 'Vinney')).rejects.toThrow(Error('Username is missing'))
		done()
	})

	test('registeration undefined password', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		expect(staff.checkDetails('vinney12', undefined, 'Vinney')).rejects.toThrow(Error('Password is missing'))
		done()
	})

	test('registeration short password', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		await expect(staff.checkDetails('vinney12', '233', 'Vinney')).rejects.toThrow(Error('Password is short'))
		done()
    })
    
    test('registeration valid details', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		await expect(staff.checkDetails('vinney12', '233', 'Vinney')).rejects.toThrow(Error('Password is short'))
		done()
    })

})
