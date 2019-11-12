'use strict'

function checkKitchenStaff(ctx, next) {
	if(ctx.session.memberType !== 'Kitchen Staff Member') {
		const unauthorizedCode = 401
		ctx.response.status = unauthorizedCode
		ctx.render('error', {error: 'Only kitchen staff can access this resource'})
	}
	return next()
}

module.exports = checkKitchenStaff
