import process from 'node:process'
import { prisma } from './prisma.js'

const categories = [
	{
		id: 1,
		name: 'Utilities',
		icon: 'utilities/other.png',
	},
	{
		id: 48,
		name: 'Cleaning',
		icon: 'utilities/cleaning.png',
		parentCategoryId: 1,
	},
	{
		id: 5,
		name: 'Electricity',
		icon: 'utilities/electricity.png',
		parentCategoryId: 1,
	},
	{
		id: 6,
		name: 'Heat/gas',
		icon: 'utilities/heat-gas.png',
		parentCategoryId: 1,
	},
	{
		id: 11,
		name: 'Other',
		icon: 'utilities/other.png',
		parentCategoryId: 1,
	},
	{
		id: 37,
		name: 'Trash',
		icon: 'utilities/trash.png',
		parentCategoryId: 1,
	},
	{
		id: 8,
		name: 'TV/Phone/Internet',
		icon: 'utilities/tv-phone-internet.png',
		parentCategoryId: 1,
	},
	{
		id: 7,
		name: 'Water',
		icon: 'utilities/water.png',
		parentCategoryId: 1,
	},
	{
		id: 2,
		name: 'Uncategorized',
		icon: 'uncategorized/general.png',
	},
	{
		id: 18,
		name: 'General',
		icon: 'uncategorized/general.png',
		parentCategoryId: 2,
	},
	{
		id: 19,
		name: 'Entertainment',
		icon: 'entertainment/other.png',
	},
	{
		id: 20,
		name: 'Games',
		icon: 'entertainment/games.png',
		parentCategoryId: 19,
	},
	{
		id: 21,
		name: 'Movies',
		icon: 'entertainment/movies.png',
		parentCategoryId: 19,
	},
	{
		id: 22,
		name: 'Music',
		icon: 'entertainment/music.png',
		parentCategoryId: 19,
	},
	{
		id: 23,
		name: 'Other',
		icon: 'entertainment/other.png',
		parentCategoryId: 19,
	},
	{
		id: 24,
		name: 'Sports',
		icon: 'entertainment/sports.png',
		parentCategoryId: 19,
	},
	{
		id: 25,
		name: 'Food and drink',
		icon: 'food-and-drink/other.png',
	},
	{
		id: 13,
		name: 'Dining out',
		icon: 'food-and-drink/dining-out.png',
		parentCategoryId: 25,
	},
	{
		id: 12,
		name: 'Groceries',
		icon: 'food-and-drink/groceries.png',
		parentCategoryId: 25,
	},
	{
		id: 38,
		name: 'Liquor',
		icon: 'food-and-drink/liquor.png',
		parentCategoryId: 25,
	},
	{
		id: 26,
		name: 'Other',
		icon: 'food-and-drink/other.png',
		parentCategoryId: 25,
	},
	{
		id: 27,
		name: 'Home',
		icon: 'home/other.png',
	},
	{
		id: 39,
		name: 'Electronics',
		icon: 'home/electronics.png',
		parentCategoryId: 27,
	},
	{
		id: 16,
		name: 'Furniture',
		icon: 'home/furniture.png',
		parentCategoryId: 27,
	},
	{
		id: 14,
		name: 'Household supplies',
		icon: 'home/household-supplies.png',
		parentCategoryId: 27,
	},
	{
		id: 17,
		name: 'Maintenance',
		icon: 'home/maintenance.png',
		parentCategoryId: 27,
	},
	{
		id: 4,
		name: 'Mortgage',
		icon: 'home/mortgage.png',
		parentCategoryId: 27,
	},
	{
		id: 28,
		name: 'Other',
		icon: 'home/other.png',
		parentCategoryId: 27,
	},
	{
		id: 29,
		name: 'Pets',
		icon: 'home/pets.png',
		parentCategoryId: 27,
	},
	{
		id: 3,
		name: 'Rent',
		icon: 'home/rent.png',
		parentCategoryId: 27,
	},
	{
		id: 30,
		name: 'Services',
		icon: 'home/services.png',
		parentCategoryId: 27,
	},
	{
		id: 31,
		name: 'Transportation',
		icon: 'transportation/other.png',
	},
	{
		id: 46,
		name: 'Bicycle',
		icon: 'transportation/bicycle.png',
		parentCategoryId: 31,
	},
	{
		id: 32,
		name: 'Bus/train',
		icon: 'transportation/bus-train.png',
		parentCategoryId: 31,
	},
	{
		id: 15,
		name: 'Car',
		icon: 'transportation/car.png',
		parentCategoryId: 31,
	},
	{
		id: 33,
		name: 'Gas/fuel',
		icon: 'transportation/gas-fuel.png',
		parentCategoryId: 31,
	},
	{
		id: 47,
		name: 'Hotel',
		icon: 'transportation/hotel.png',
		parentCategoryId: 31,
	},
	{
		id: 34,
		name: 'Other',
		icon: 'transportation/other.png',
		parentCategoryId: 31,
	},
	{
		id: 9,
		name: 'Parking',
		icon: 'transportation/parking.png',
		parentCategoryId: 31,
	},
	{
		id: 35,
		name: 'Plane',
		icon: 'transportation/plane.png',
		parentCategoryId: 31,
	},
	{
		id: 36,
		name: 'Taxi',
		icon: 'transportation/taxi.png',
		parentCategoryId: 31,
	},
	{
		id: 40,
		name: 'Life',
		icon: 'life/other.png',
	},
	{
		id: 50,
		name: 'Childcare',
		icon: 'life/childcare.png',
		parentCategoryId: 40,
	},
	{
		id: 41,
		name: 'Clothing',
		icon: 'life/clothing.png',
		parentCategoryId: 40,
	},
	{
		id: 49,
		name: 'Education',
		icon: 'life/education.png',
		parentCategoryId: 40,
	},
	{
		id: 42,
		name: 'Gifts',
		icon: 'life/gifts.png',
		parentCategoryId: 40,
	},
	{
		id: 10,
		name: 'Insurance',
		icon: 'life/insurance.png',
		parentCategoryId: 40,
	},
	{
		id: 43,
		name: 'Medical expenses',
		icon: 'life/medical-expenses.png',
		parentCategoryId: 40,
	},
	{
		id: 44,
		name: 'Other',
		icon: 'life/other.png',
		parentCategoryId: 40,
	},
	{
		id: 45,
		name: 'Taxes',
		icon: 'life/taxes.png',
		parentCategoryId: 40,
	},
]

async function main() {
	for (const category of categories) {
		const existing = await prisma.category.findUnique({
			where: { id: category.id },
		})

		if (existing) {
			await prisma.category.update({
				where: { id: category.id },
				data: {
					name: category.name,
					icon: category.icon,
					parentCategoryId: category.parentCategoryId ?? null,
				},
			})
		} else {
			await prisma.category.create({
				data: category,
			})
		}
	}
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (error) => {
		console.error(error)
		await prisma.$disconnect()
		process.exit(1)
	})
