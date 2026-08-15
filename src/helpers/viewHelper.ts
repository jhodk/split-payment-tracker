import { config } from '../config.js'
import type { Category } from '../database/generated/client.js'

export const prefixImageHost = (path: string) => `${config.fileHost}${path}`

export const buildCategoryGroups = (categories: Category[]) => {
	const sorted = categories.slice().sort((a, b) => {
		if (a.name === 'Uncategorized') return -1
		if (b.name === 'Uncategorized') return 1
		return a.name.localeCompare(b.name)
	})

	return sorted
		.filter((category) => category.parentCategoryId === null)
		.map((parent) => ({
			...parent,
			children: categories.filter((category) => category.parentCategoryId === parent.id),
		}))
}
