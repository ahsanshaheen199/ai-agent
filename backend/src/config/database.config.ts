import 'dotenv/config';

import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import { appConfig } from './app.config';

export const dbOptions: DataSourceOptions = {
	type: 'postgres',
	host: appConfig.DB_HOST,
	username: appConfig.DB_USERNAME,
	password: appConfig.DB_PASSWORD,
	database: appConfig.DB_NAME,
	logging: appConfig.NODE_ENV === 'development',
	entities: [path.join(__dirname, '../database/entities/*{.ts,.js}')],
	migrations: [path.join(__dirname, '../database/migrations/*{.ts,.js}')],
	synchronize: false,
	ssl: true,
};

export const appDataSource = new DataSource(dbOptions);
