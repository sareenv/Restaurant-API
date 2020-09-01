'use strict'

const MongoClient = require('mongodb').MongoClient
require('dotenv').config({path: '../.env'})
const authDb = {}

const url = process.env.DB_AUTH_URI

MongoClient.connect(url, {useUnifiedTopology: true})
	.then((client) => {
		authDb.client = client
		authDb.database = client.db('340ct144514ros')

	}).catch(() => {
		throw new Error('Error connecting to the database.')
	})

module.exports = authDb
