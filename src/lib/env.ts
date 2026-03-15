const required = (key: string): string => {
	const value = process.env[key];
	if (!value) throw new Error(`Missing required environment variable: ${key}`);
	return value;
};

const optional = (key: string, fallback = ""): string =>
	process.env[key] ?? fallback;

export const env = {
	// ── Spotify ───────────────────────────────────────────────────────────
	SPOTIFY_CLIENT_ID: required("SPOTIFY_CLIENT_ID"),
	SPOTIFY_CLIENT_SECRET: required("SPOTIFY_CLIENT_SECRET"),
	SPOTIFY_REFRESH_TOKEN: required("SPOTIFY_REFRESH_TOKEN"),

	// ── SMTP (all optional — omitting them logs to console instead) ───────
	SMTP_HOST: optional("SMTP_HOST"),
	SMTP_PORT: Number(optional("SMTP_PORT", "587")),
	SMTP_SECURE: optional("SMTP_SECURE", "false") === "true",
	SMTP_USER: optional("SMTP_USER"),
	SMTP_PASS: optional("SMTP_PASS"),
	CONTACT_EMAIL: optional("CONTACT_EMAIL", "darmawandeveloper@gmail.com"),
};
