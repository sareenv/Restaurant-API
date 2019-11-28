
'use strict'

jest.setTimeout(30000)

const {MongoClient} = require('mongodb')
const Order = require('../modules/order')

let connection
let db

beforeAll(async() => {
	connection = await MongoClient.connect(global.__MONGO_URI__, {
		useUnifiedTopology: true,
	})
	db = await connection.db(global.__MONGO_DB_NAME__)
})

describe('new orders', () => {

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
		await expect(order.orderRegistration(undefined, 'Chikken Tikka')).rejects.toThrow(Error('undefined details'))
		done()
	})

	test('missing order items', async done => {
		expect.assertions(1)
		const order = new Order(db)
		await expect(order.orderRegistration(14, undefined)).rejects.toThrow(Error('undefined details'))
		done()
	})

	test('Invalid table number type', async done => {
		expect.assertions(1)
		const order = new Order(db)
		await expect(order.orderRegistration('sam', 'Chicken Tikka')).rejects.toThrow( Error('Invalid table number') )
		done()
	})

	test('Undefined staff Authority for ready orders', async done => {
		expect.assertions(1)
		const order = new Order(db)
		const operation = order.readyOrders(undefined)
		await expect(operation).rejects.toThrow(Error('undefined accessType'))
		done()
	})

	test('Missing staff Authority for ready orders', async done => {
		expect.assertions(1)
		const order = new Order(db)
		await expect(order.readyOrders('')).rejects.toThrow(Error('missing accessType'))
		done()
	})

	test('Invalid staff Authority for ready orders', async done => {
		expect.assertions(1)
		const order = new Order(db)
		await expect(order.readyOrders('Manager')).rejects.toThrow(Error('Only, Waiting staff can call for collection'))
		done()
	})


	test('no ready orders', async done => {
		expect.assertions(1)
		const order = new Order(db)
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

	test('undefined admin Id', async done => {
		expect.assertions(1)
		const order = new Order(db)
		const operation = order.fetchAllOrders(undefined)
		await expect(operation).rejects.toThrow(Error('undefined accessType'))
		done()
	})

	test('missing admin Id', async done => {
		expect.assertions(1)
		const order = new Order(db)
		const operation = order.fetchAllOrders('')
		await expect(operation).rejects.toThrow(Error('missing admin Id'))
		done()
	})

	test('Invalid admin Id', async done => {
		expect.assertions(1)
		const order = new Order(db)
		const operation = order.fetchAllOrders('jklel')
		await expect(operation).rejects.toThrow(Error('Only, Admin can access this resource'))
		done()
	})

	test('Valid order fetch', async done => {
		expect.assertions(1)
		const order = new Order(db)
		const currentDate = new Date().toLocaleDateString()
		const details = {tablenumber: 14, orderedItems: ['Fish'], pending: false, time: '15:18:40', date: currentDate}
		await db.collection('Orders').insertOne(details)
		const operation = order.fetchAllOrders('admin')
		await expect(operation).resolves.toEqual([details])
		done()
	})

})

