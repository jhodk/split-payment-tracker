import * as express from 'express'
import { paymentService } from '../services/paymentService.js'
import { userService } from '../services/userService.js'

// /payments
export const paymentController = express.Router()

paymentController.get('/', async (req, res) => {
	// biome-ignore lint/style/noNonNullAssertion: user is authenticated
	const userId = req.session.userId!
	const user = await userService.getById(userId)
	if (!user) {
		throw new Error('Logged in user not found')
	}
	const { payments, summary } = await paymentService.getAll(userId)

	const otherUser = await userService.getOtherUser(userId)
	if (!otherUser) {
		throw new Error('No other user found')
	}

	return res.render('payments/index', {
		pageTitle: 'All Payments',
		userId: req.session.userId,
		payments,
		summary,
		groupName: `${user.name} and ${otherUser.name}`,
	})
})

paymentController.get('/create', async (req, res) => {
	// biome-ignore lint/style/noNonNullAssertion: user is authenticated
	const userId = req.session.userId!
	const user = await userService.getById(userId)

	const otherUser = await userService.getOtherUser(userId)
	if (!otherUser) {
		throw new Error('No other user found')
	}

	return res.render('payments/create', {
		pageTitle: 'Add payment',
		user,
		otherUser,
	})
})

paymentController.post('/', async (req, res) => {
	const payerId = Number(req.body.payerId)
	const amount = req.body.amount
	const splitType = req.body.split
	const description = req.body.description
	const categoryId = Number(req.body.categoryId)

	const allUserIds = (await userService.getAll()).map((u) => u.id)
	const splits = paymentService.calculateSplits({
		amount,
		payerId,
		splitType,
		userIds: allUserIds,
	})

	await paymentService.create({
		payerId,
		description,
		amount,
		splits,
		categoryId,
	})

	return res.redirect('/')
})

paymentController.get('/:id/edit', async (req, res) => {
	// biome-ignore lint/style/noNonNullAssertion: user is authenticated
	const userId = req.session.userId!
	const paymentId = Number(req.params.id)

	const payment = await paymentService.getById(paymentId)

	if (!payment) {
		return res.status(404).send('Payment not found')
	}

	const user = await userService.getById(userId)
	if (!user) {
		throw new Error('Logged in user not found')
	}
	const otherUser = await userService.getOtherUser(user.id)

	if (!otherUser) {
		return res.status(400).send('No other user found')
	}

	res.render('payments/update', {
		pageTitle: 'Edit payment',
		payment,
		user,
		otherUser,
	})
})

paymentController.post('/:id/edit', async (req, res) => {
	const paymentId = Number(req.params.id)
	const payerId = Number(req.body.payerId)
	const amount = req.body.amount
	const splitType = req.body.split
	const categoryId = Number(req.body.categoryId)

	const userIds = (await userService.getAll()).map((user) => user.id)

	const splits = paymentService.calculateSplits({
		payerId,
		userIds,
		amount,
		splitType,
	})

	await paymentService.update(paymentId, {
		payerId,
		description: req.body.description,
		amount,
		splits,
		categoryId,
	})

	res.redirect('/')
})

paymentController.use((_req, res) => {
	return res.redirect('/')
})
