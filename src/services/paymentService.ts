import Big from 'big.js'
import type { Payment, Prisma } from '../database/generated/client.js'
import { prisma } from '../database/prisma.js'
import { userService } from './userService.js'

type CreatePaymentArgs = {
	authorId: number
	payerId: number
	description: string
	amount: string
	splits: PaymentSplitInput[]
	categoryId: number
}

type PaymentSplitInput = {
	userId: number
	amount: string
}

export type SplitType = '100-0' | '50-50' | '0-100'

type CalculateSplitsInput = {
	payerId: number
	userIds: number[]
	amount: string
	splitType: SplitType
}

type PaymentWithSplitsAndPayerAndCategory = Prisma.PaymentGetPayload<{
  include: {
    splits: true
    payer: true
	category: true
  }
}>

const roundUpToPennies = (amount: Big): Big => {
	return amount.round(2, Big.roundUp)
}

export const paymentService = {
	create: async ({ payerId, description, amount, splits, categoryId, authorId }: CreatePaymentArgs): Promise<Payment> => {
		return await prisma.payment.create({
			data: {
				amount,
				description,
				categoryId,
				payerId,
				createdById: authorId,
				splits: {
					create: splits,
				},
			},
		})
	},
	update: async (id: number, { payerId, description, amount, splits, categoryId, authorId }: CreatePaymentArgs): Promise<Payment> => {
		return prisma.$transaction(async (tx) => {
			await tx.paymentSplit.deleteMany({
				where: {
					paymentId: id,
				},
			})

			return tx.payment.update({
				where: {
					id,
				},
				data: {
					payerId,
					description,
					amount,
          			categoryId,
					updatedById: authorId,
					updatedAt: new Date().toISOString(),
					splits: {
						create: splits,
					},
				},
			})
		})
	},
	calculateSplits: ({ payerId, userIds, amount, splitType }: CalculateSplitsInput): PaymentSplitInput[] => {
		const payerIndex = userIds.indexOf(payerId)
		if (payerIndex === -1) {
			throw new Error('Payer must be one of the users')
		}
		if (userIds.length !== 2) {
			throw new Error('Payment must have exactly two users')
		}

		const otherUserId = userIds.find((id) => id !== payerId)
		if (otherUserId === undefined) {
			throw new Error('Could not find other user id')
		}

		const total = new Big(amount)

		if (splitType === '100-0') {
			return [
				{ userId: payerId, amount: total.toFixed(2) },
				{ userId: otherUserId, amount: '0.00' },
			]
		}

		if (splitType === '0-100') {
			return [
				{ userId: payerId, amount: '0.00' },
				{ userId: otherUserId, amount: total.toFixed(2) },
			]
		}

		const otherAmount = roundUpToPennies(total.div(2))
		const payerAmount = total.minus(otherAmount)

		return [
			{ userId: payerId, amount: payerAmount.toFixed(2) },
			{ userId: otherUserId, amount: otherAmount.toFixed(2) },
		]
	},
	getById: async (id: number): Promise<PaymentWithSplitsAndPayerAndCategory | null> => {
		const foo = prisma.payment.findUnique({
			where: {
				id,
			},
			include: {
				payer: true,
				splits: true,
				category: true,
			},
		})
		return foo
	},
	getAll: async (userId: number) => {
		const [payments, otherUser] = await Promise.all([
			prisma.payment.findMany({
				include: {
					payer: true,
					splits: true,
					category: true,
				},
				orderBy: {
					createdAt: 'desc',
				},
			}),
			userService.getOtherUser(userId),
		])

		const paymentsWithBalance = payments.map((payment) => {
			const split = payment.splits.find((split) => split.userId === userId)

			if (!split) {
				throw new Error(`User ${userId} is not included in payment ${payment.id}`)
			}

			const amount = new Big(payment.amount.toString())
			const splitAmount = new Big(split.amount.toString())

			const userBalance = payment.payerId === userId ? amount.minus(splitAmount) : splitAmount.times(-1)

			return {
				...payment,
				amount: amount.toFixed(2),
				splitAmount: splitAmount.toFixed(2),
				userBalance: userBalance.toFixed(2),
				date: payment.createdAt.toLocaleDateString('en-US', {
					month: 'short',
					day: '2-digit',
				}),
			}
		})

		const overallBalance = paymentsWithBalance.reduce((total, payment) => total.plus(payment.userBalance), new Big(0))

		return {
			payments: paymentsWithBalance,
			summary: {
				balance: overallBalance.toFixed(2),
				otherUserName: otherUser?.name ?? 'Other user',
			},
		}
	},
}
