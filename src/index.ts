import express from 'express'
import { config } from './config.js'
import { dbHealthCheck } from './database/prisma.js'

const app = express()
app.set('view engine', 'pug')
app.set('views', './src/views')

await dbHealthCheck()

app.get('/', (_req, res) => {
	res.render('index')
})

app.listen(config.port, () => {
	console.log(`Server running on http://localhost:${config.port}`)
})
