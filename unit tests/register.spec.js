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

describe('check registration details', () => {

	afterAll(async() => {
		await db.collection('Staff').deleteMany({})
		await connection.close()
		await db.close()
	})


	test('undefined username', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.registration(undefined, 'bxbhsxwt3-fb', 'Vinney', 'Waiting Staff Member')
		await expect(operation).rejects.toThrow(Error('missing details'))
		done()
	})

	test('invalid Member Type', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.registration('vinney12', 'bxbhsxwt3-fb', 'Vinney', 'dddxyx')
		await expect(operation).rejects.toThrow(Error('Invalid member type'))
		done()
	})


	test('undefined password', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.registration('vinney12', undefined, 'Vinney', 'Waiting Staff Member')
		expect(operation).rejects.toThrow(Error('missing details'))
		done()
	})

	test('short password', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.registration('vinney12', 'cbx', 'Vinney', 'Waiting Staff Member')
		await expect(operation).rejects.toThrow(Error('Password is short'))
		done()
	})

	test('undefined name', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.registration('vinney12', 'BXWT3979-db', undefined, 'Waiting Staff Member')
		expect(operation).rejects.toThrow(Error('missing details'))
		done()
	})

	test('existing username', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const d = {username: 'josh', hashedPassword: 'BXW456-db125', name: 'vinney', memberType: 'Waiting Staff Member'}
		await db.collection('Staff').insertOne(d)
		const operation = staff.registration('josh', 'BXWT3979-db', 'Vinney', 'Kitchen Staff Member')
		await expect(operation).rejects.toThrow(Error('username already exist'))
		done()
	})

	test('correct details', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		await expect(staff.registration('vinney', 'BXWT3979-db', 'Vinney', 'Waiting Staff Member')).resolves.toBe(true)
		done()
	})

})
