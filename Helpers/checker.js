'use strict'

function checkUndefinedValues(...values) {
	let i
	for(i = 0; i< values.length; i++) {
		if(values[i] === undefined) return true
	}
	return false
}

function checkMissingValues(...values) {
	if(values.includes(undefined)) return false
	let i
	for(i = 0; i< values.length; i++) {
		if(values[i].length <= 0) return true
	}
	return false
}

function isParsableDouble(value) {
	const result = parseFloat(value)
	if (isNaN(result)) return false
	return result
}

function checkPrice(value) {
	const parseCheck = isParsableDouble(value)
	if(parseCheck === false) return false
	return true
}

module.exports = { checkUndefinedValues, checkMissingValues, checkPrice }
