import * as express from 'express'

// /payments
export const paymentController = express.Router()

paymentController.get('/', (req, res) => {
	return res.render('index', { userId: req.session.userId })
})

paymentController.use((_req, res) => {
	return res.redirect('/')
})
