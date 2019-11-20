'use strict'

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


describe('check member status', () => {

	afterAll(async() => {
		await connection.close()
		await db.close()
	})
	test('missing username', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		await expect(staff.checkStaffStatus('')).rejects.toThrow(Error('missing username'))
		done()
	})
	test('no username', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const d = {username: 'josh', hashedPassword: 'BXW456-db125', name: 'vinney', memberType: 'Waiting Staff Member'}
		await db.collection('Staff').insertOne(d)
		await expect(staff.checkStaffStatus('josha')).rejects.toThrow(Error('No staff member'))
		done()
	})

	test('correct details', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const d = {username: 'josh', hashedPassword: 'BXW456-db125', name: 'vinney', memberType: 'Waiting Staff Member'}
		await db.collection('Staff').insertOne(d)
		await expect(staff.checkStaffStatus('josh')).resolves.toEqual('Waiting Staff Member')
		await db.collection('Staff').deleteMany({})
		done()
	})
})
