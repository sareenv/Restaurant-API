
'use strict'

function checkWaitingStaff(ctx, next) {
	if(ctx.session.memberType !== 'Waiting Staff Member') {
		const unauthorizedCode = 401
		ctx.response.status = unauthorizedCode
		return ctx.render('error', {error: 'Only Waiting Staff can access this resource'})
	}
	return next()
}

module.exports = checkWaitingStaff
