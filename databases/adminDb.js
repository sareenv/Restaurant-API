'use strict'

const MongoClient = require('mongodb').MongoClient

const adminDb = {}

const url = 'mongodb://vinayak:BXWT3-db@ds039078.mlab.com:39078/340ctadmin'

MongoClient.connect(url, {useUnifiedTopology: true})
	.then((client) => {
		adminDb.client = client
		adminDb.database = client.db('340ctadmin')

	}).catch(() => {
		throw new Error('Error connecting to the database.')
	})

module.exports = adminDb
