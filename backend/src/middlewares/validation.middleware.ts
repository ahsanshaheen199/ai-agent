import { validate } from 'class-validator';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@/http-error/validation.error';

export function validationMiddleware<T extends object>(
	type: ClassConstructor<T>
) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const body =
				req.body && typeof req.body === 'object' ? req.body : {};

			const dtoObject = plainToInstance(type, body);

			const errors = await validate(dtoObject, {
				whitelist: true,
				forbidUnknownValues: true,
				validationError: { target: false, value: false },
			});

			if (errors.length > 0) {
				const formattedErrors = errors.reduce(
					(acc: Record<string, string[]>, err) => {
						if (err.constraints) {
							acc[err.property] = Object.values(err.constraints);
						}
						return acc;
					},
					{}
				);

				next(new ValidationError('Validation failed', formattedErrors));
				return;
			}

			next();
		} catch (err) {
			next(err);
		}
	};
}
