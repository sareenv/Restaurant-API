'use strict'

jest.mock('../__mocks__/bcrypt-promise')
jest.mock('../__mocks__/fs-extra')

const {MongoClient} = require('mongodb')
const Admin = require('../modules/admin')

describe('admin stats', () => {
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

	test('undefined filename', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.saveStats(undefined, '100')
		await expect(operation).rejects.toThrow(Error('values undefined'))
		done()
	})

	test('undefined content', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.saveStats('stats.txt', undefined)
		await expect(operation).rejects.toThrow(Error('values undefined'))
		done()
	})

	test('missing filename', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.saveStats('', '100')
		await expect(operation).rejects.toThrow(Error('missing details'))
		done()
	})

	test('missing content', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.saveStats('stats.txt', '')
		await expect(operation).rejects.toThrow(Error('missing details'))
		done()
	})

	test('correct content', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.saveStats('s.txt', 'profit')
		await expect(operation).resolves.toBe(true)
		done()
	})

	test('existing file', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.saveStats('profit', 'hello.txt')
		await expect(operation).resolves.toBe(false)
		done()
	})
})
