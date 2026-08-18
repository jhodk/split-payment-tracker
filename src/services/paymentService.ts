import Big from 'big.js'
import type { LedgerEntry, LedgerEntryType, Payment, Prisma } from '../database/generated/client.js'
import { prisma } from '../database/prisma.js'
import { userService } from './userService.js'

type CreatePaymentArgs = {
	authorId: number
	payerId: number
	description: string
	amount: string
	ledgerEntries: LedgerEntryInput[]
	categoryId: number
	date: Date
}

type LedgerEntryInput = {
	userId: number
	direction: LedgerEntryType
	amount: string
}

export type SplitType = '100-0' | '50-50' | '0-100'

type CalculateSplitsInput = {
	payerId: number
	userIds: number[]
	amount: string
	splitTypeFromPerspectiveOfPayer: SplitType
}

type PaymentWithLedgerEntriesAndPayerAndCategory = Prisma.PaymentGetPayload<{
	include: {
		ledgerEntries: true
		payer: true
		category: true
	}
}>

const roundUpToPennies = (amount: Big): Big => {
	return amount.round(2, Big.roundUp)
}

export const paymentService = {
	create: async ({
		payerId,
		description,
		amount,
		ledgerEntries,
		categoryId,
		authorId,
		date,
	}: CreatePaymentArgs): Promise<Payment> => {
		return await prisma.payment.create({
			data: {
				description,
				amount,
				categoryId,
				payerId,
				date,
				createdById: authorId,
				ledgerEntries: {
					create: ledgerEntries,
				},
			},
		})
	},
	update: async (
		id: number,
		{ payerId, description, amount, ledgerEntries, categoryId, authorId, date }: CreatePaymentArgs,
	): Promise<Payment> => {
		return prisma.$transaction(async (tx) => {
			await tx.ledgerEntry.deleteMany({
				where: {
					paymentId: id,
				},
			})

			return tx.payment.update({
				where: {
					id,
				},
				data: {
					description,
					amount,
					categoryId,
					payerId,
					date,
					updatedById: authorId,
					updatedAt: new Date().toISOString(),
					ledgerEntries: {
						create: ledgerEntries,
					},
				},
			})
		})
	},
	calculateLedgerEntries: ({
		payerId,
		userIds,
		amount,
		splitTypeFromPerspectiveOfPayer: splitType,
	}: CalculateSplitsInput): LedgerEntryInput[] => {
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
				{ userId: payerId, direction: 'DEBIT', amount: total.toFixed(2) },
				{ userId: payerId, direction: 'CREDIT', amount: total.toFixed(2) },
			]
		}

		if (splitType === '0-100') {
			return [
				{ userId: payerId, direction: 'DEBIT', amount: total.toFixed(2) },
				{ userId: otherUserId, direction: 'CREDIT', amount: total.toFixed(2) },
			]
		}

		const otherAmount = roundUpToPennies(total.div(2))
		const payerAmount = total.minus(otherAmount)

		return [
			{ userId: payerId, direction: 'DEBIT', amount: total.toFixed(2) },
			{ userId: payerId, direction: 'CREDIT', amount: payerAmount.toFixed(2) },
			{ userId: otherUserId, direction: 'CREDIT', amount: otherAmount.toFixed(2) },
		]
	},
	getById: async (id: number): Promise<PaymentWithLedgerEntriesAndPayerAndCategory | null> => {
		const foo = prisma.payment.findUnique({
			where: {
				id,
			},
			include: {
				payer: true,
				ledgerEntries: true,
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
					ledgerEntries: true,
					category: true,
				},
				orderBy: {
					createdAt: 'desc',
				},
			}),
			userService.getOtherUser(userId),
		])

		const paymentsWithBalance = payments.map((payment) => {
			const paymentAmount = new Big(payment.amount.toString())

			const userBalance = payment.ledgerEntries
				.filter((ledgerEntry) => ledgerEntry.userId === userId)
				.reduce((acc: Big, next: LedgerEntry) => {
					const amount = new Big(next.amount.toString()).times(next.direction === 'CREDIT' ? -1 : 1)

					return acc.add(amount)
				}, new Big(0))

			return {
				...payment,
				amount: paymentAmount.toFixed(2),
				userBalance: userBalance.toFixed(2),
				date: payment.date.toLocaleDateString('en-US', {
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
