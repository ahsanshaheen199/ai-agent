import { getEnv } from '../utlis/get-env';

export const appConfig = {
	PORT: getEnv('PORT', '8000'),
	FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:3000'),
	DB_HOST: getEnv('DB_HOST', 'localhost'),
	DB_PORT: getEnv('DB_PORT', '5432'),
	DB_USERNAME: getEnv('DB_USERNAME'),
	DB_PASSWORD: getEnv('DB_PASSWORD'),
	DB_NAME: getEnv('DB_NAME'),
	NODE_ENV: getEnv('NODE_ENV', 'development'),
	JWT_SECRET: getEnv('JWT_SECRET'),
};
