'use strict'

function hash(password, hashRounds) {
	return Promise.resolve(`${password}123123${hashRounds}`)
}

module.exports = hash
