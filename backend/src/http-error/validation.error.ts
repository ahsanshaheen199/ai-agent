import { HttpError } from 'routing-controllers';

export class ValidationError extends HttpError {
	name = 'ValidationError';
	errors: Record<string, string[]> = {};

	constructor(message: string, errors: Record<string, string[]>) {
		super(422);
		Object.setPrototypeOf(this, ValidationError.prototype);

		this.errors = errors || {};
		if (message) {
			this.message = message;
		}
	}
}
