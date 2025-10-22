import { appConfig } from './app.config';
import passport from 'passport';
import { Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { User } from '@/database/entities/user.entity';
import { Request } from 'express';
import { appDataSource } from './database.config';

const extractJwtFromBearerToken = (req: Request) => {
	let token = null;
	if (req && req.headers.authorization) {
		token = req.headers.authorization.split(' ')[1];
	}
	return token;
};

const options: StrategyOptions = {
	secretOrKey: appConfig.JWT_SECRET,
	jwtFromRequest: extractJwtFromBearerToken,
};

type JwtPayload = {
	id: string;
};

passport.use(
	new JwtStrategy(options, async (payload: JwtPayload, done) => {
		if (!payload || !payload.id) {
			return done(null, false);
		}

		try {
			const user = await appDataSource.getRepository(User).findOne({
				where: { id: payload.id },
			});
			if (!user) {
				return done(null, false);
			}
			return done(null, user);
		} catch (error) {
			return done(error, false);
		}
	})
);

passport.serializeUser((user: User, done) => done(null, user));
passport.deserializeUser((user: User, done) => done(null, user));
