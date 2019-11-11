'use strict'

const MongoClient = require('mongodb').MongoClient

const store = {}

const url = 'mongodb://vinayak:BXWT3-db@ds243148.mlab.com:43148/340ct144514ros'

MongoClient.connect(url, {useUnifiedTopology: true})
	.then((client) => {
		store.client = client
		store.database = client.db('340ct144514ros')

	}).catch(() => {
		throw new Error('Error connecting to the database.')
	})

module.exports = store
