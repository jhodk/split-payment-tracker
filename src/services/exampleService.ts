interface IExampleService {
	double(input: number): number
}

export class ExampleService implements IExampleService {
	public double(input: number): number {
		return input * 2
	}
}
