import express from 'express'
import { config, isProduction } from './config.js'
import { homeController } from './controllers/homeController.js'
import { paymentController } from './controllers/paymentController.js'
import { dbHealthCheck } from './database/prisma.js'
import { requireLogin } from './middleware/requireLogin.js'
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

app.use('/payments', requireLogin, paymentController)
app.use(homeController)

app.use((_req, res) => {
	res.redirect('/login')
})

app.listen(config.port, () => {
	console.log(`Server running on http://localhost:${config.port}`)
})
