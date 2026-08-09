import 'dotenv/config'

import { defineConfig } from 'prisma/config'
import { config } from './src/config.js'

const { user, password, host, port, dbName } = config.database

export default defineConfig({
	schema: 'src/database/schema.prisma',
	migrations: {
		path: 'src/database/migrations',
		seed: 'tsx src/database/seed.ts',
	},
	datasource: {
		url: `mysql://${user}:${password}@${host}:${port}/${dbName}`,
	},
})
