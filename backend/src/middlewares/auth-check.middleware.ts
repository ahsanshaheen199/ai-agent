import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { UnauthorizedError } from 'routing-controllers';

export const authCheckMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	passport.authenticate('jwt', { session: false }, (err, user) => {
		if (err || !user) {
			next(new UnauthorizedError('Unauthorized'));
			return;
		}
		req.user = user;
		next();
	})(req, res, next);
};
