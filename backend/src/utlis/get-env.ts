export const getEnv = (key: string, defaultValue?: string) => {
	const value = process.env[key];
	if (!value && !defaultValue) {
		throw new Error(`Environment variable ${key} is not set`);
	}
	if (!value && defaultValue) {
		return defaultValue;
	}
	return value;
};
