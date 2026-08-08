import express from 'express'
import { config } from './config.js'

const app = express()
app.set('view engine', 'pug')
app.set('views', './src/views')

app.get('/', (_req, res) => {
	res.render('index')
})

app.listen(config.port, () => {
	console.log(`Server running on http://localhost:${config.port}`)
})
