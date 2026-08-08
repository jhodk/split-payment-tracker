import { spawn } from 'node:child_process'
import { config } from '../src/config.js'

spawn(
	'browser-sync',
	[
		'start',
		'--proxy',
		`http://localhost:${config.port}`,
		'--port',
		config.browserSyncPort ?? '3001',
		'--files',
		'src/views/**/*.pug,src/public/**/*',
	],
	{
		stdio: 'inherit',
		shell: true,
	},
)
