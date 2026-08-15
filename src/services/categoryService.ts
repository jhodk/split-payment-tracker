import type { Category } from '../database/generated/client.js'
import { prisma } from '../database/prisma.js'

export const categoryService = {
	getAll: async (): Promise<Category[]> => {
		return prisma.category.findMany()
	},
}
