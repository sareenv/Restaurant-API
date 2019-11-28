'use strict'

const {MongoClient} = require('mongodb')
const Staff = require('../modules/staff')

jest.setTimeout(30000)
let connection
let db
beforeAll(async() => {
	connection = await MongoClient.connect(global.__MONGO_URI__, {
		useUnifiedTopology: true,
	})
	db = await connection.db(global.__MONGO_DB_NAME__)
})

describe('login History', () => {

	afterAll(async() => {
		await connection.close()
		await db.close()
	})

	test('undefined details', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.loginHistory(undefined)
		await expect(operation).rejects.toThrow(Error('undefined member Id'))
		done()
	})

	test('missing details', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.loginHistory('')
		await expect(operation).rejects.toThrow(Error('missing member Id'))
		done()
	})

	test('Invalid Staff Id', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.loginHistory('6787887')
		await expect(operation).rejects.toThrow(Error('member cannot be verified'))
		done()
	})

	test('Login History', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const authHistory = {login: {currentTime: '14:05', currentDate: '04/08/19'}}
		const details = {username: 'ko', password: 'Bh5', authHistory: [{loginDetails: authHistory}]}
		await db.collection('Staff').insertOne(details)
		const operation = staff.loginHistory('ko')
		await expect(operation).resolves.toEqual(details.authHistory)
		done()
	})

	test('Logout undefined username', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const authHistory = {login: {currentTime: '14:05', currentDate: '04/08/19'}}
		const details = {username: 'pinku', password: 'Bh5', authHistory: [{loginDetails: authHistory}]}
		await db.collection('Staff').insertOne(details)
		const operation = staff.logoutDetailsUpdate(undefined)
		await expect(operation).rejects.toThrow(Error('undefined member Id'))
		done()
	})

	test('Logout missing username', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const authHistory = {login: {currentTime: '14:05', currentDate: '04/08/19'}}
		const details = {username: 'pinku', password: 'Bh5', authHistory: [{loginDetails: authHistory}]}
		await db.collection('Staff').insertOne(details)
		const operation = staff.logoutDetailsUpdate('')
		await expect(operation).rejects.toThrow(Error('missing member Id'))
		done()
	})

	test('correct update Logout History', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const authHistory = {login: {currentTime: '14:05', currentDate: '04/08/19'}}
		const details = {username: 'plo', password: 'Bh5', authHistory: [{loginDetails: authHistory}]}
		await db.collection('Staff').insertOne(details)
		const operation = staff.logoutDetailsUpdate('plo')
		await expect(operation).resolves.toEqual(true)
		done()
	})

	test('Invalid logout History', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const details = {username: 'vikas', password: 'Bh5', authHistory: []}
		await db.collection('Staff').insertOne(details)
		const operation = staff.logoutDetailsUpdate('vikas')
		await expect(operation).resolves.toEqual(false)
		done()
	})

	test('Logout Invalid staff member', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const operation = staff.logoutDetailsUpdate('kiya')
		await expect(operation).rejects.toThrow(Error('member cannot be verified'))
		done()
	})

	test('pushing logout Details', async done => {
		expect.assertions(1)
		const staff = new Staff(db)
		const authHistory = {login: {currentTime: '14:05', currentDate: '04/08/19'}}
		const operation = staff.pushlogoutDetails({authHistory: [{loginDetails: authHistory}]})
		await expect(operation).resolves.toBe(true)
		done()
	})

})
