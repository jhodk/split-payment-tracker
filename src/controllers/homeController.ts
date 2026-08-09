import * as express from 'express'
import { destroySession, isLoggedIn } from '../helpers/authHelper.js'
import { authService } from '../services/authService.js'

export const homeController = express.Router()

homeController.get('/login', (req, res) => {
	if (isLoggedIn(req.session)) {
		return res.redirect('/payments')
	}

	return res.render('login')
})

homeController.post('/login', (req, res) => {
	if (isLoggedIn(req.session)) {
		return res.redirect('/index')
	}

	res.redirect(authService.getGoogleOauthLoginUri())
})

homeController.get('/auth-redirect', async (req, res) => {
	if (typeof req.query.code !== 'string') {
		return res.redirect('/login')
	}

	await authService.handleAuthorisationCode({ session: req.session, code: req.query.code })

	return res.redirect('/login')
})

homeController.get('/logout', async (req, res) => {
	if (isLoggedIn(req.session)) {
		console.info(`Destroying session for user id ${req.session.userId}`)
		await destroySession(req.session)
	}

	return res.redirect('/login')
})
