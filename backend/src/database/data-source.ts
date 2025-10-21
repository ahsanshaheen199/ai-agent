import { appDataSource } from '../config/database.config';

export const initializeDataSource = async () => {
	try {
		await appDataSource.initialize();
		console.log('Data Source has been initialized!');
	} catch (error) {
		console.error('Error during Data Source initialization', error);
		process.exit(1);
	}
};
