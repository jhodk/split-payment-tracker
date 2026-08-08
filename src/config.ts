import { env } from 'prisma/config'

export const config = {
	port: env('PORT') ? parseInt(env('PORT'), 10) : 3000,
	browserSyncPort: env('BROWSER_SYNC_PORT'),
	database: {
		host: env('DATABASE_HOST'),
		user: env('DATABASE_USER'),
		password: env('DATABASE_PASSWORD'),
		dbName: env('DATABASE_NAME'),
		port: env('DATABASE_PORT'),
	},
}
