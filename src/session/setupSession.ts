import session from 'express-session'
import { config, isProduction } from '../config.js'
import type { Express } from '../index.js'
import { getRedisStore } from './redisStore.js'

const ONE_MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30

export const setupSession = async (app: Express): Promise<void> => {
	app.use(
		session({
			secret: config.sessionSecret,
			resave: false,
			saveUninitialized: false,
			cookie: {
				secure: isProduction(),
				maxAge: ONE_MONTH_IN_MS,
				path: config.basePath || '/',
			},
			name: 'sessionId',
			store: await getRedisStore(),
		}),
	)
}
