'use strict'

function checkUndefinedValues(...values) {
	let i
	for(i = 0; i< values.length; i++) {
		if(values[i] === undefined) return true
	}
	return false
}

function checkMissingValues(...values) {
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
	const typeCheck = checkDataType('number', parseCheck)
	if(typeCheck === false) return false
	return true
}

function checkDataType(type, ...values) {
	let i
	for(i = 0; i< values.length; i++) {
		if(typeof values[i] !== type) return false
	}
	return true
}

module.exports = { checkUndefinedValues, checkMissingValues, checkDataType, checkPrice }
