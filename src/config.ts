export const config = {
	port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
	browserSyncPort: process.env.BROWSER_SYNC_PORT,
}
