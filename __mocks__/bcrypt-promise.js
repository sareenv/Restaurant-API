'use strict'

function hash(password, hashRounds) {
	return Promise.resolve(`${password}12${hashRounds}`)
}
async function compare(password, hashPassword) {
	const hashRounds = 5
	const userPasswordHash = await hash(password, hashRounds)
	if(userPasswordHash === hashPassword) {
		return Promise.resolve(true)
	}
	return Promise.resolve(false)
}
module.exports = {hash, compare}
