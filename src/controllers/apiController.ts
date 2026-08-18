import * as express from 'express'
import { prisma } from '../database/prisma.js'
import { paymentService } from '../services/paymentService.js'
import { userService } from '../services/userService.js'

export const apiController = express.Router()

apiController.post('/v1/payments', async (req, res) => {
	const payerId = Number(req.body.payerId)
	const createdById = Number(req.body.createdById)
	const description = req.body.description
	const amount = req.body.amount
	const categoryId = Number(req.body.categoryId)
	const date = new Date(req.body.date)

	const allUserIds = (await userService.getAll()).map((u) => u.id)
	const ledgerEntries = paymentService.calculateLedgerEntries({
		amount,
		payerId,
		splitTypeFromPerspectiveOfPayer: '50-50',
		userIds: allUserIds,
	})

	const payment = await prisma.payment.create({
		data: {
			description,
			amount,
			categoryId,
			payerId,
			date,
			createdById,

			ledgerEntries: {
				create: ledgerEntries,
			},
		},
	})

	return res.status(200).json({ id: payment.id })
})

apiController.post('/v1/payments/bulk', async (req, res) => {
	try {
		const payments = req.body

		if (!Array.isArray(payments)) {
			return res.status(400).json({
				error: 'Request body must be an array of payments',
			})
		}

		const allUserIds = new Set((await userService.getAll()).map((u) => u.id))

		const validPayments = payments.filter((payment) => {
			const createdById = Number(payment.createdById)
			const ledgerEntries = payment.ledgerEntries

			if (!allUserIds.has(createdById)) {
				console.warn(`Skipping payment with unknown createdById: ${createdById}`, payment)
				return false
			}

			if (!Array.isArray(ledgerEntries)) {
				console.warn(`Skipping payment with invalid ledgerEntries: ${JSON.stringify(payment)}`)
				return false
			}

			if (ledgerEntries.length > 3 || ledgerEntries.length < 2) {
				console.warn(
					`Skipping payment with unexpected ledger array length ${ledgerEntries.length}: ${JSON.stringify(payment)}`,
				)
				return false
			}

			return true
		})

		const createdPayments = await prisma.$transaction(
			validPayments.map((payment) => {
				const createdById = Number(payment.createdById)
				const amount = payment.amount
				const categoryId = Number(payment.categoryId)
				const description = payment.description
				const ledgerEntries = payment.ledgerEntries

				if (!allUserIds.has(createdById)) {
					throw new Error(`Unknown createdById: ${createdById}`)
				}

				if (!Array.isArray(ledgerEntries)) {
					throw new Error('ledgerEntries must be an array')
				}

				if (ledgerEntries.length > 3 || ledgerEntries.length < 2) {
					console.warn(`ledger array had unexpected length ${ledgerEntries.length}: ${JSON.stringify(payment)}`)
				}

				for (const entry of ledgerEntries) {
					const userId = Number(entry.userId)

					if (!allUserIds.has(userId)) {
						throw new Error(`Unknown ledger entry userId: ${userId}`)
					}

					if (entry.direction !== 'DEBIT' && entry.direction !== 'CREDIT') {
						throw new Error(`Invalid ledger entry direction: ${entry.direction}`)
					}
				}

				return prisma.payment.create({
					data: {
						description,
						amount,
						categoryId,
						payerId: ledgerEntries.find((ledgerEntry) => ledgerEntry.direction === 'DEBIT')!.userId,
						date: new Date(payment.date),
						createdAt: new Date(payment.createdAt),
						createdById,

						ledgerEntries: {
							create: ledgerEntries.map((entry) => ({
								userId: Number(entry.userId),
								direction: entry.direction,
								amount: entry.amount,
							})),
						},
					},
				})
			}),
		)

		return res.status(200).json({
			count: createdPayments.length,
			ids: createdPayments.map((payment) => payment.id),
		})
	} catch (error: unknown) {
		console.error(error)

		return res.status(400).json({
			error: error instanceof Error ? error.message : 'Unknown error',
		})
	}
})
