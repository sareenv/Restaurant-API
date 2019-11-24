'use strict'

jest.setTimeout(30000)

const {MongoClient} = require('mongodb')
const Admin = require('../modules/admin')


let connection
let db

beforeAll(async() => {
	connection = await MongoClient.connect(global.__MONGO_URI__, {
		useUnifiedTopology: true,
	})
	db = await connection.db(global.__MONGO_DB_NAME__)
})

describe('menuItemupdate', () => {

	beforeEach(async() => {
		await db.collection('Menu').deleteMany({})
	})

	afterAll(async() => {
		await connection.close()
		await db.close()
	})

	test('undefined id', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.updateMenuItem(undefined, 'Fish and Chips', 34)
		await expect(operation).rejects.toThrow(Error('undefined details'))
		done()
	})

	test('undefined name', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.updateMenuItem('3467bxwt31', undefined, 34)
		await expect(operation).rejects.toThrow(Error('undefined details'))
		done()
	})

	test('undefined price', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.updateMenuItem('3467bxwt32', 'Fish and Chips', undefined)
		await expect(operation).rejects.toThrow(Error('undefined details'))
		done()
	})

	test('missing id', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.updateMenuItem('', 'Fish and Chips', 34)
		await expect(operation).rejects.toThrow(Error('missing details'))
		done()
	})

	test('invalid price Ammount', async done => {
		await db.collection('Menu').insertOne({_id: '3467bxwt32', itemName: 'Fish and Chips', itemPrice: 32})
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.updateMenuItem('3467bxwt32', 'Fish and Chips', 'somerandomValue')
		await expect(operation).rejects.toThrow(Error('Invalid Ammount'))
		done()
	})

	test('non existing item', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		await db.collection('Menu').deleteMany({})
		const operation = admin.updateMenuItem('3467bxwtq2', 'Fish and Chips', 43)
		await expect(operation).rejects.toThrow(Error('Menu Item doesnot exist'))
		done()
	})

	test('correct details', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		await db.collection('Menu').insertOne({_id: '3467bxwt32', itemName: 'Fish and Chips', itemPrice: 32})
		const operation = admin.updateMenuItem('3467bxwt32', 'Fish and Chips', '23')
		await expect(operation).resolves.toBe(true)
		done()
	})

})
