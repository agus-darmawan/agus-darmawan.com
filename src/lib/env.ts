const requiredEnv = (key: string): string => {
	console.log(`Loading environment variable: ${key}`);
	const value = process.env[key];
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return value;
};

export const env = {
	SPOTIFY_CLIENT_ID: requiredEnv("SPOTIFY_CLIENT_ID"),
	SPOTIFY_CLIENT_SECRET: requiredEnv("SPOTIFY_CLIENT_SECRET"),
	SPOTIFY_REFRESH_TOKEN: requiredEnv("SPOTIFY_REFRESH_TOKEN"),
};
