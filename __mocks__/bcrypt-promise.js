'use strict'

function hash(password, hashRounds) {
	return Promise.resolve(`${password}123123${hashRounds}`)
}
function compare(password, hashPassword) {
	const hashRounds = '5'
	if(hashPassword === `${password}123123${hashRounds})`) {
		return Promise.resolve(true)
	}
	return Promise.resolve(false)
}
module.exports = {hash, compare}
