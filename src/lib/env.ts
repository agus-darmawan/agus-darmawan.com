import "server-only";
import { z } from "zod";
import { SITE } from "@/config/site";

/**
 * Server-side environment.
 *
 * Every integration is optional: a missing Spotify / SMTP / Turnstile key
 * disables that feature instead of crashing unrelated routes (or the build).
 */
const optional = z
	.string()
	.optional()
	.transform((v) => (v?.trim() ? v.trim() : undefined));

const envSchema = z.object({
	// ── Spotify (now-playing widget) ──────────────────────────────────────────
	SPOTIFY_CLIENT_ID: optional,
	SPOTIFY_CLIENT_SECRET: optional,
	SPOTIFY_REFRESH_TOKEN: optional,

	// ── SMTP (contact form — logs to console if not set) ──────────────────────
	SMTP_HOST: optional,
	SMTP_PORT: z.coerce.number().default(587),
	// NOTE: z.coerce.boolean() turns the string "false" into `true` — parse explicitly.
	SMTP_SECURE: z
		.string()
		.optional()
		.transform((v) => v === "true" || v === "1"),
	SMTP_USER: optional,
	SMTP_PASS: optional,
	// An empty value (as copied from .env.example) falls back to SITE.email.
	CONTACT_EMAIL: optional
		.pipe(z.email().optional())
		.transform((v) => v ?? SITE.email),

	// ── Cloudflare Turnstile (skips verification if not set) ──────────────────
	TURNSTILE_SECRET_KEY: optional,

	// ── GitHub (project enrichment — 60 → 5000 req/h when set) ───────────────
	GITHUB_TOKEN: optional,

	// ── Views & likes (Upstash Redis — hidden when not set) ──────────────────
	UPSTASH_REDIS_REST_URL: optional.pipe(z.url().optional()),
	UPSTASH_REDIS_REST_TOKEN: optional,
	// The names Vercel's Upstash integration uses.
	KV_REST_API_URL: optional.pipe(z.url().optional()),
	KV_REST_API_TOKEN: optional,
	META_SALT: optional,
	// "memory": keep counts in the server process (development, e2e tests).
	META_STORE: optional.pipe(z.enum(["memory"]).optional()),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error("❌ Invalid environment variables:");
	console.error(z.flattenError(parsed.error).fieldErrors);
	throw new Error("Invalid environment variables — check .env.example");
}

export const env = parsed.data;

export const isSpotifyConfigured = Boolean(
	env.SPOTIFY_CLIENT_ID &&
		env.SPOTIFY_CLIENT_SECRET &&
		env.SPOTIFY_REFRESH_TOKEN,
);
