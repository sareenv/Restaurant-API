
'use strict'

jest.setTimeout(30000)

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

	beforeEach(async() => {
		await db.collection('Menu').deleteMany({})
		const mockMenuItems = [ {name: 'Chicken Tikka', price: 20}, {name: 'Fish and Chips', price: 20}]
		await db.collection('Menu').insertMany(mockMenuItems)
	})

	afterAll(async() => {
		await connection.close()
		await db.close()
	})

	test('order registration', async done => {
		expect.assertions(1)
		const order = new Order(db)
		await expect(order.orderRegistration(14, 'Chikken Tikka')).toBeTruthy()
		done()
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

	test('Invalid staff Authority for ready orders', async done => {
		expect.assertions(1)
		const order = new Order(db)
		await expect(order.readyOrders()).rejects.toThrow(Error('Only, Waiting staff can call for collection'))
		done()
	})

	test('no ready orders', async done => {
		expect.assertions(1)
		const order = new Order(db)
		const details = {tablenumber: 14, orderedItems: ['Chicken'], pending: true, time: '15:18:40'}
		await db.collection('Orders').insertOne(details)
		await expect(order.readyOrders('Waiting Staff Member')).resolves.toBeFalsy()
		await db.collection('Orders').deleteMany({})
		done()
	})

	test('ready orders', async done => {
		expect.assertions(1)
		const order = new Order(db)
		const details = {tablenumber: 14, orderedItems: ['Chicken'], pending: false, time: '15:18:40'}
		await db.collection('Orders').insertOne(details)
		await expect(order.readyOrders('Waiting Staff Member')).resolves.toEqual([details])
		await db.collection('Orders').deleteMany({})
		done()
	})

})

