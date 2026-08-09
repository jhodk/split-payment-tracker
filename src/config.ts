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
}
