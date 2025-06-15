export class UnknowError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UnknowError";
	}
}
