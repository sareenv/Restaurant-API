
'use strict'

function checkAdminAccount(ctx, next) {
	if(ctx.session.adminAccess !== true) {
		const unauthorizedCode = 401
		ctx.response.status = unauthorizedCode
		return ctx.render('error', {error: 'Only Admin can access this resource'})
	}
	return next()
}

module.exports = checkAdminAccount
