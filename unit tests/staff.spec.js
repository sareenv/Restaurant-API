/* eslint-disable max-len */
'use strict'

jest.mock('../__mocks__/bcrypt-promise')
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
		await db.collection('Staff').insertOne({username: 'josh', password: 'BXWT3456-db', name: 'vinney'})
	})

	afterAll(async() => {
		await connection.close()
		await db.close()
	})

	test('undefined username', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		await expect(staff.registration(undefined, 'bxbhsxwt3-fb', 'Vinney')).rejects.toThrow(Error())
		done()
	})

	test('undefined password', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		expect(staff.registration('vinney12', undefined, 'Vinney')).rejects.toThrow(Error())
		done()
	})

	test('undefined name', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		expect(staff.registration('vinney12', 'BXWT3979-db', undefined)).rejects.toThrow(Error())
		done()
	})

	test('short password', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		await expect(staff.registration('vinney12', 'cbx', 'Vinney')).rejects.toThrow(Error('Password is short'))
		done()
	})

	test('existing username', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		await expect(staff.registration('josh', 'BXWT3979-db', 'Vinney')).rejects.toThrow(Error('username already exist'))
		done()
	})

	test('correct details', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		await expect(staff.registration('jkl', 'BXWT3979-db', 'Vinney')).toBe(true)
		done()
	})

})
