'use strict'

function checkUndefinedValues(...values) {
	values.forEach(value => {
		if(value === undefined) return false
	})
	return true
}

function checkMissingValues(...values) {
	values.forEach(value => {
		if(value.length <= 0) return false
	})
	return true
}

function checkDataType(type, ...values) {
	values.forEach(value => {
		if(typeof value !== type) return false
	})
	return false
}

module.exports = { checkUndefinedValues, checkMissingValues, checkDataType }
