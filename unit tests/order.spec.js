/* eslint-disable max-len */
'use strict'

const {MongoClient} = require('mongodb')
const Order = require('../modules/order')

describe('insert', () => {
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
		await expect(order.orderRegistration('sample12', 'Chicken Tikka')).rejects.toThrow( Error('Invalid type for table number') )
		done()
	})

	test('Invalid menu items', async done => {
		expect.assertions(1)
		const itemName = 'Humus'
		const result = await db.collection('Menu').findOne({name: itemName})
		expect(result).toBeNull()
		done()
	})

})
