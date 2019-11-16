
'use strict'

jest.setTimeout(30000)

const {MongoClient} = require('mongodb')
const Order = require('../modules/order')

describe('pending orders', () => {
	let connection
	let db


	beforeAll(async() => {
		connection = await MongoClient.connect(global.__MONGO_URI__, {
			useUnifiedTopology: true,
		})
		db = await connection.db(global.__MONGO_DB_NAME__)
	})

	beforeEach(async() => {
		await db.collection('Orders').deleteMany({})
		const mockOrders = [ {pending: true, _id: 1234, orderedItem: 'Fish'} ]
		await db.collection('Orders').insertMany(mockOrders)
	})

	afterAll(async() => {
		await db.collection('Orders').drop().exec()
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

	test('pending Orders List', async done => {
		expect.assertions(1)
		const order = new Order(db)
		const operation = order.pendingOrders('Kitchen Staff Member')
		const mockOrders = [ {pending: true, _id: 1234, orderedItem: 'Fish'} ]
		await expect(operation).resolves.toStrictEqual(mockOrders)
		done()
	})

	test('collection invalid order id', async done => {
		expect.assertions(1)
		const order = new Order(db)
		const operation = order.collectionReadyOrders(12, 'Kitchen Staff Member')
		await expect(operation).resolves.toBe(false)
		done()
	})


	test('missing collection order id', async done => {
		expect.assertions(1)
		const order = new Order(db)
		const operation = order.collectionReadyOrders('', 'Kitchen Staff Member')
		await expect(operation).rejects.toThrow(Error('Id cannot be missing or empty'))
		done()
	})

	test('undefined collection order id', async done => {
		expect.assertions(1)
		const order = new Order(db)
		const operation = order.collectionReadyOrders(undefined, 'Kitchen Staff Member')
		await expect(operation).rejects.toThrow(Error('Id cannot be missing or empty'))
		done()
	})

	test('correct collection details', async done => {
		expect.assertions(1)
		const order = new Order(db)
		const operation = order.collectionReadyOrders(1234, 'Kitchen Staff Member')
		await expect(operation).resolves.toBe(true)
		done()
	})
})
