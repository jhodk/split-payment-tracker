import type { User } from '../database/generated/client.js'
import { prisma } from '../database/prisma.js'

export const userService = {
	getById: async (id: number): Promise<User | null> => {
		return await prisma.user.findUnique({ where: { id } })
	},
	getOtherUser: async (excludedId: number): Promise<User | null> => {
		return await prisma.user.findFirst({
			where: {
				id: {
					not: excludedId,
				},
			},
		})
	},
	getAll: async (): Promise<User[]> => {
		return await prisma.user.findMany()
	},
}
