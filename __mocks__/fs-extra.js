'use strict'

function writeFile(fileName, data) {
	const filedata = {name: fileName, content: data}
	const contents = [{name: 'hello.txt', content: 'profit'}]
	const compareResults = fileName === 'hello.txt' && data === 'profit'
	console.log(fileName)
	if(compareResults) return Promise.reject(false)
	contents.push(filedata)
	return Promise.resolve(true)
}

module.exports = { writeFile }
