'use strict'

jest.mock('../__mocks__/bcrypt-promise')
jest.setTimeout(30000)

const {MongoClient} = require('mongodb')
const Staff = require('../modules/staff')

let connection
let db

beforeAll(async() => {
	connection = await MongoClient.connect(global.__MONGO_URI__, {
		useUnifiedTopology: true,
	})
	db = await connection.db(global.__MONGO_DB_NAME__)
})

describe('login', () => {

	afterAll(async() => {
		await db.collection('Staff').deleteMany({})
		await connection.close()
		await db.close()
	})

	test('missing username', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.login(undefined, 'bxbhsxwt3-fb')
		await expect(operation).rejects.toThrow(Error('Missing details'))
		done()
	})

	test('no user found', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const details = {username: 'josh', hashedPassword: 'BX56-db125', name: 'vi', memberType: 'Waiting Staff Member'}
		await db.collection('Staff').insertOne(details)
		const operation = staff.login('vinayak', 'bxbhsxwt3-fb')
		await expect(operation).rejects.toThrow(Error('No user found'))
		done()
	})

	test('missing password', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.login('vinayak', undefined)
		await expect(operation).rejects.toThrow(Error('Missing details'))
		done()
	})

	test('password not matched', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const details = {username: 'josh', hashedPassword: 'BX56-db125', name: 'vi', memberType: 'Waiting Staff Member'}
		await db.collection('Staff').insertOne(details)
		const operation = staff.login('josh', 'sample-db')
		await expect(operation).resolves.toBe(false)
		done()
	})

})
