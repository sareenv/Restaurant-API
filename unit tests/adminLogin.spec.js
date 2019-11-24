'use strict'

jest.mock('../__mocks__/bcrypt-promise')

const {MongoClient} = require('mongodb')
const Admin = require('../modules/admin')

describe('adminLogin', () => {
	let connection
	let db

	beforeAll(async() => {
		connection = await MongoClient.connect(global.__MONGO_URI__, {
			useUnifiedTopology: true,
		})
		db = await connection.db(global.__MONGO_DB_NAME__)
	})

	beforeEach(async() => {
		await db.collection('AdminLogin').deleteMany({})
	})

	test('undefined admin username', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.adminLogin(undefined, 'BXWT3-db')
		await expect(operation).rejects.toThrow(Error('undefined credentials'))
		done()
	})

	test('non existing username', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.adminLogin('njxb', 'BXWT3-db')
		await expect(operation).rejects.toThrow(Error('admin username not found'))
		done()
	})

	test('undefined admin password', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.adminLogin('sareenv', undefined)
		await expect(operation).rejects.toThrow(Error('undefined credentials'))
		done()
	})

	test('missing admin password', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		await db.collection('AdminLogin').insertOne({username: 'sareenv', password: 'BXWT3-db'})
		const operation = admin.adminLogin('sareenv', '')
		await expect(operation).rejects.toThrow(Error('missing details'))
		done()
	})

	test('wrong credentials', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		await db.collection('AdminLogin').insertOne({username: 'sareenv', password: 'Bddx-db1210'})
		const operation = admin.adminLogin('sareenv', 'testpasswb')
		await expect(operation).resolves.toBe(false)
		done()
	})

})
