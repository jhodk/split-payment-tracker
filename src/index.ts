import express from 'express'
import { config, isProduction } from './config.js'
import { dbHealthCheck } from './database/prisma.js'
import { setupSession } from './session/setupSession.js'

console.log('Checking db connection...')
await dbHealthCheck()
console.log('Db connection established')

const app = express()
export type Express = typeof app

await setupSession(app)

app.set('view engine', 'pug')
app.set('views', './src/views')

if (isProduction()) {
	app.set('trust proxy', 1)
}

app.get('/', (_req, res) => {
	res.render('index')
})

app.listen(config.port, () => {
	console.log(`Server running on http://localhost:${config.port}`)
})
