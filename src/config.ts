import { randomUUID } from 'node:crypto'

if (!process.env.SESSION_SECRET) {
	console.warn(
		'Warning, no SESSION_SECRET set so defaulting to random UUID. Sessions will not persist through restarts!',
	)
}

export const config = {
	port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
	browserSyncPort: process.env.BROWSER_SYNC_PORT,
	database: {
		host: process.env.DATABASE_HOST,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		dbName: process.env.DATABASE_NAME,
		port: process.env.DATABASE_PORT,
	},
	sessionSecret: process.env.SESSION_SECRET ?? randomUUID(),
	nodeEnv: process.env.NODE_ENV ?? 'development',
	oauth: {
		gcp: {
			clientId: process.env.GCP_OAUTH_CLIENT_ID ?? '',
			clientSecret: process.env.GCP_OAUTH_CLIENT_SECRET ?? '',
		},
		redirectUri: process.env.OAUTH_REDIRECT_URI ?? '',
	},
	fileHost: process.env.FILE_HOST ?? '',
}

export const isProduction = (): boolean => config.nodeEnv === 'production'
