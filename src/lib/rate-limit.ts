/**
 * Tiny fixed-window rate limiter.
 *
 * In-memory, so on serverless it limits per warm instance — enough to stop
 * a single client hammering an endpoint, not a distributed attack (put
 * Cloudflare/Vercel rules in front for that).
 */
export function createRateLimiter({
	limit,
	windowMs,
}: {
	limit: number;
	windowMs: number;
}) {
	const hits = new Map<string, { count: number; resetAt: number }>();

	return function check(key: string, now = Date.now()) {
		// Opportunistic cleanup keeps the map from growing without bound.
		if (hits.size > 1_000) {
			for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
		}

		const entry = hits.get(key);
		if (!entry || entry.resetAt <= now) {
			hits.set(key, { count: 1, resetAt: now + windowMs });
			return { ok: true, retryAfterSeconds: 0 };
		}

		entry.count += 1;
		return {
			ok: entry.count <= limit,
			retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
		};
	};
}

/** Best-effort client IP from proxy headers (Vercel / Cloudflare / nginx). */
export function clientIp(headers: Headers): string {
	return (
		headers.get("cf-connecting-ip") ??
		headers.get("x-real-ip") ??
		headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
		"unknown"
	);
}
