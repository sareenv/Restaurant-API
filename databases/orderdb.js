'use strict'

const MongoClient = require('mongodb').MongoClient

const order = {}

const url = 'mongodb://vinayak:BXWT3-db@ds245018.mlab.com:45018/340ctorders'
MongoClient.connect(url, {useUnifiedTopology: true})
	.then((client) => {
		order.client = client
		order.database = client.db('340ctorders')
	}).catch(() => {
		throw new Error('Error connecting to the database.')
	})

module.exports = order
