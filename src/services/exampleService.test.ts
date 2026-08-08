import { describe, expect, test } from 'vitest'
import { ExampleService } from './exampleService.js'

const buildExampleService = (): ExampleService => new ExampleService()

describe('ExampleService', () => {
	describe('double', () => {
		test.each([
			{ input: -1.5, expected: -3 },
			{ input: 0, expected: 0 },
			{ input: 1, expected: 2 },
			{ input: 1.25, expected: 2.5 },
		])('it doubles $input to $expected', ({ input, expected }) => {
			const underTest = buildExampleService()

			const act = underTest.double(input)

			expect(act).toBe(expected)
		})
	})
})
