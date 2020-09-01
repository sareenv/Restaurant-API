'use strict'

const MongoClient = require('mongodb').MongoClient

const order = {}

const url = process.env.DB_ORDER_URI
MongoClient.connect(url, {useUnifiedTopology: true})
	.then((client) => {
		order.client = client
		order.database = client.db('340ctorders')
	}).catch(() => {
		throw new Error('Error connecting to the database.')
	})

module.exports = order
