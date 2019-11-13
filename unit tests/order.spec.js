
'use strict'

const {MongoClient} = require('mongodb')
const Order = require('../modules/order')

describe('new orders', () => {
	let connection
	let db

	beforeAll(async() => {
		connection = await MongoClient.connect(global.__MONGO_URI__, {
			useUnifiedTopology: true,
		})
		db = await connection.db(global.__MONGO_DB_NAME__)
		const mockMenuItems = [ {name: 'Chicken Tikka', price: 20}, {name: 'Fish and Chips', price: 20}]
		await db.collection('Menu').insertMany(mockMenuItems)
	})

	afterAll(async() => {
		await connection.close()
		await db.close()
	})

	test('order registration', async() => {
		const order = new Order(db)
		await expect(order.orderRegistration(14, 'Chikken Tikka')).toBeTruthy()
	})

	test('missing table number', async done => {
		expect.assertions(1)
		const order = new Order(db)
		await expect(order.orderRegistration(undefined, 'Chikken Tikka')).rejects.toThrow(Error('missing table number'))
		done()
	})

	test('missing order items', async done => {
		expect.assertions(1)
		const order = new Order(db)
		await expect(order.orderRegistration(14, undefined)).rejects.toThrow(Error('missing orderedItems'))
		done()
	})

	test('Invalid table number type', async done => {
		expect.assertions(1)
		const order = new Order(db)
		await expect(order.orderRegistration('sam', 'Chicken Tikka')).rejects.toThrow( Error('Invalid table number') )
		done()
	})
})

describe('pending orders', () => {
	let connection
	let db

	beforeAll(async() => {
		connection = await MongoClient.connect(global.__MONGO_URI__, {
			useUnifiedTopology: true,
		})
		db = await connection.db(global.__MONGO_DB_NAME__)
		const mockOrders = [ {pending: true, id: 1234, orderedItem: 'Fish'} ]
		await db.collection('Orders').insertMany(mockOrders)
	})

	afterAll(async() => {
		await connection.close()
		await db.close()
	})

	test('invalid memberType', async done => {
		expect.assertions(1)
		const order = new Order(db)
		await expect(order.pendingOrders('Staff')).rejects.toThrow(Error('only kitchen member can see pending orders'))
		done()
	})

	test('Invalid Authority', async done => {
		expect.assertions(1)
		const order = new Order(db)
		const operation = order.collectionReadyOrders(123, 'Waiting Staff')
		await expect(operation).rejects.toThrow(Error('Only, Kitch staff can call for collection'))
		done()
	})

})
