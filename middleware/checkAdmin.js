
'use strict'

const jwt = require('jsonwebtoken')
const unauthorisedStatusCode = 401

async function checkAdminAccount(ctx, next) {
	const authHeader = ctx.headers.authorization
	const authMessage = 'Authorisation Header not found, Cannot verify you'
	if(authHeader === undefined) {
		ctx.status = unauthorisedStatusCode
		return ctx.body = {error: true, message: authMessage}
	}
	const jwtToken = authHeader
	const verify = await jwt.verify(jwtToken, 'darkSecret340Admin')
	const memberType = verify.memberType
	if(memberType !== 'admin') {
		ctx.status = unauthorisedStatusCode
		return ctx.body = {error: true, message: 'Only kitchen staff can access this resource'}
	}
	return next()
}

module.exports = checkAdminAccount
