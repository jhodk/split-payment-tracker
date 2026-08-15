import type * as express from 'express'
import { config } from '../config.js'

export const requireBearerAuth: express.RequestHandler = (req, res, next) => {
	const bearerToken = req.headers.authorization?.match(/^Bearer (.*)/)?.at(1)
	if (bearerToken !== config.apiSecret) {
		return res.status(401).json({ statusCode: 401, error: 'UNAUTHORIZED' })
	}

	return next()
}
