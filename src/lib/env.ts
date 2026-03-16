import { z } from "zod";

const envSchema = z.object({
	// ── Spotify (required) ────────────────────────────────────────────────────
	SPOTIFY_CLIENT_ID: z.string().min(1),
	SPOTIFY_CLIENT_SECRET: z.string().min(1),
	SPOTIFY_REFRESH_TOKEN: z.string().min(1),

	// ── SMTP (optional — logs to console if not set) ──────────────────────────
	SMTP_HOST: z.string().optional(),
	SMTP_PORT: z.coerce.number().default(587),
	SMTP_SECURE: z.coerce.boolean().default(false),
	SMTP_USER: z.string().optional(),
	SMTP_PASS: z.string().optional(),
	CONTACT_EMAIL: z.string().email().default("darmawandeveloper@gmail.com"),

	// ── Cloudflare Turnstile (optional — skips verification if not set) ───────
	TURNSTILE_SECRET_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error("❌ Invalid environment variables:");
	console.error(parsed.error.flatten().fieldErrors);
	throw new Error("Invalid environment variables — check .env.example");
}

export const env = parsed.data;
