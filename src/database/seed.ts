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
	},
	{
		id: 5,
		name: 'Electricity',
		icon: 'utilities/electricity.png',
	},
	{
		id: 6,
		name: 'Heat/gas',
		icon: 'utilities/heat-gas.png',
	},
	{
		id: 11,
		name: 'Other',
		icon: 'utilities/other.png',
	},
	{
		id: 37,
		name: 'Trash',
		icon: 'utilities/trash.png',
	},
	{
		id: 8,
		name: 'TV/Phone/Internet',
		icon: 'utilities/tv-phone-internet.png',
	},
	{
		id: 7,
		name: 'Water',
		icon: 'utilities/water.png',
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
	},
	{
		id: 21,
		name: 'Movies',
		icon: 'entertainment/movies.png',
	},
	{
		id: 22,
		name: 'Music',
		icon: 'entertainment/music.png',
	},
	{
		id: 23,
		name: 'Other',
		icon: 'entertainment/other.png',
	},
	{
		id: 24,
		name: 'Sports',
		icon: 'entertainment/sports.png',
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
	},
	{
		id: 12,
		name: 'Groceries',
		icon: 'food-and-drink/groceries.png',
	},
	{
		id: 38,
		name: 'Liquor',
		icon: 'food-and-drink/liquor.png',
	},
	{
		id: 26,
		name: 'Other',
		icon: 'food-and-drink/other.png',
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
	},
	{
		id: 16,
		name: 'Furniture',
		icon: 'home/furniture.png',
	},
	{
		id: 14,
		name: 'Household supplies',
		icon: 'home/household-supplies.png',
	},
	{
		id: 17,
		name: 'Maintenance',
		icon: 'home/maintenance.png',
	},
	{
		id: 4,
		name: 'Mortgage',
		icon: 'home/mortgage.png',
	},
	{
		id: 28,
		name: 'Other',
		icon: 'home/other.png',
	},
	{
		id: 29,
		name: 'Pets',
		icon: 'home/pets.png',
	},
	{
		id: 3,
		name: 'Rent',
		icon: 'home/rent.png',
	},
	{
		id: 30,
		name: 'Services',
		icon: 'home/services.png',
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
	},
	{
		id: 32,
		name: 'Bus/train',
		icon: 'transportation/bus-train.png',
	},
	{
		id: 15,
		name: 'Car',
		icon: 'transportation/car.png',
	},
	{
		id: 33,
		name: 'Gas/fuel',
		icon: 'transportation/gas-fuel.png',
	},
	{
		id: 47,
		name: 'Hotel',
		icon: 'transportation/hotel.png',
	},
	{
		id: 34,
		name: 'Other',
		icon: 'transportation/other.png',
	},
	{
		id: 9,
		name: 'Parking',
		icon: 'transportation/parking.png',
	},
	{
		id: 35,
		name: 'Plane',
		icon: 'transportation/plane.png',
	},
	{
		id: 36,
		name: 'Taxi',
		icon: 'transportation/taxi.png',
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
	},
	{
		id: 41,
		name: 'Clothing',
		icon: 'life/clothing.png',
	},
	{
		id: 49,
		name: 'Education',
		icon: 'life/education.png',
	},
	{
		id: 42,
		name: 'Gifts',
		icon: 'life/gifts.png',
	},
	{
		id: 10,
		name: 'Insurance',
		icon: 'life/insurance.png',
	},
	{
		id: 43,
		name: 'Medical expenses',
		icon: 'life/medical-expenses.png',
	},
	{
		id: 44,
		name: 'Other',
		icon: 'life/other.png',
	},
	{
		id: 45,
		name: 'Taxes',
		icon: 'life/taxes.png',
	},
]

async function main() {
	await prisma.category.createMany({
		data: categories,
		skipDuplicates: true,
	})
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
