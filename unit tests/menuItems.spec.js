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

describe('MenuItemsOperations', () => {

	afterAll(async() => {
		await connection.close()
		await db.close()
	})

	test('undefined menu item Name', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.registerMenuItem(undefined, 32, 'description', [{name: 'Chicken', price: 32}])
		await expect(operation).rejects.toThrow(Error('Missing details'))
		done()
	})

	test('undefined menu item description', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.registerMenuItem('Fish and Chips', 32, undefined, [{name: 'Chicken', price: 32}])
		await expect(operation).rejects.toThrow(Error('Missing details'))
		done()
	})

	test('missing menu item Name', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.registerMenuItem('', 32, 'description', [{name: 'Chicken', price: 32}])
		await expect(operation).rejects.toThrow(Error('Missing details'))
		done()
	})


	test('missing menu description', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.registerMenuItem('Fish and Chips', 32, '', [{name: 'Chicken', price: 32}])
		await expect(operation).rejects.toThrow(Error('Missing details'))
		done()
	})

	test('invalid price', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		const operation = admin.registerMenuItem('Fish and Chips', 'aaa', 'Fish', [{name: 'Chicken', price: 32}])
		await expect(operation).rejects.toThrow(Error('invalid price'))
		done()
	})

	test('existing menu items', async done => {
		expect.assertions(1)
		const admin = new Admin(db)
		await db.collection('Menu').insertOne({itemName: 'Fish and Chips', itemPrice: 32, itemDescription: 'Fish'})
		const operation = admin.registerMenuItem('Fish and Chips', 32, 'Fish', [{name: 'Chicken', price: 32}])
		await expect(operation).rejects.toThrow(Error('item already exist in system'))
		done()
	})

})
