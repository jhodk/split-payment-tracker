import * as express from 'express'
import { paymentService, type SplitType } from '../services/paymentService.js'
import { userService } from '../services/userService.js'
import { splitTypeForPayer } from '../helpers/splitHelper.js'

export const apiController = express.Router()

apiController.post('/v1/payments', async (req, res) => {
	const payerId = Number(req.body.payerId)
	const userId = Number(req.body.userId)
	const description = req.body.description
	const amount = req.body.amount
	const categoryId = Number(req.body.categoryId)

	// split type is expressed in terms of the current user, not the payer
	let splitType = splitTypeForPayer(req.body.split as SplitType, userId, payerId)

	const allUserIds = (await userService.getAll()).map((u) => u.id)
	const splits = paymentService.calculateSplits({
		amount,
		payerId,
		splitType,
		userIds: allUserIds,
	})

	const payment = await paymentService.create({
		payerId,
		description,
		amount,
		splits,
		categoryId,
		authorId: userId
	})

	return res.status(200).json({id: payment.id})
})