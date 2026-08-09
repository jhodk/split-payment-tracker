import type * as express from 'express'
import { isLoggedIn } from '../helpers/authHelper.js'

export const requireLogin: express.RequestHandler = (req, res, next) => {
	if (!isLoggedIn(req.session)) {
		console.info('User is not logged in. Redirecting to login page.')
		return res.redirect('/login')
	}

	return next()
}
