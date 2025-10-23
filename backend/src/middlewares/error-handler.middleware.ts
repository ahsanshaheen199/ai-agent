import {
	Middleware,
	ExpressErrorMiddlewareInterface,
	HttpError,
} from 'routing-controllers';
import { Request, Response } from 'express';
import { ValidationError } from '../http-error/validation.error';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
	error(error: Error, request: Request, response: Response): Response {
		// console.log(`Error Occured on PATH: ${request.path}`, error);

		if (response.headersSent) {
			return response;
		}

		if (error instanceof SyntaxError) {
			return response.status(400).json({
				message: 'Invalid JSON',
				error: error?.message || 'Something went wrong',
			});
		}

		if (error instanceof ValidationError) {
			return response.status(error.httpCode).json({
				message: error.message,
				errors: error.errors,
			});
		}

		if (error instanceof HttpError) {
			return response
				.status(error.httpCode)
				.json({ message: error.message });
		}

		return response.status(500).json({ message: 'Internal Server Error' });
	}
}
