'use strict'

const MongoClient = require('mongodb').MongoClient
require('dotenv').config({path: '../.env'})
const adminDb = {}

const url = process.env.DB_ADMIN_URI

MongoClient.connect(url, {useUnifiedTopology: true})
	.then((client) => {
		adminDb.client = client
		adminDb.database = client.db('340ctadmin')

	}).catch(() => {
		throw new Error('Error connecting to the database.')
	})

module.exports = adminDb
