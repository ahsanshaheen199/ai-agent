import { getEnv } from '../utlis/get-env';

export const appConfig = {
	PORT: getEnv('PORT', '8000'),
	FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:3000'),
};
