import { describe, expect, it } from "vitest";
import { clientIp, createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
	it("allows `limit` hits per window, then blocks with Retry-After", () => {
		const check = createRateLimiter({ limit: 2, windowMs: 60_000 });
		expect(check("a", 0).ok).toBe(true);
		expect(check("a", 1_000).ok).toBe(true);
		const blocked = check("a", 2_000);
		expect(blocked.ok).toBe(false);
		expect(blocked.retryAfterSeconds).toBe(58);
		expect(check("b", 2_000).ok).toBe(true);
	});

	it("resets after the window", () => {
		const check = createRateLimiter({ limit: 1, windowMs: 1_000 });
		expect(check("a", 0).ok).toBe(true);
		expect(check("a", 500).ok).toBe(false);
		expect(check("a", 1_000).ok).toBe(true);
	});
});

describe("clientIp", () => {
	it("prefers proxy-provided headers", () => {
		expect(
			clientIp(new Headers({ "x-forwarded-for": "1.1.1.1, 10.0.0.1" })),
		).toBe("1.1.1.1");
		expect(
			clientIp(
				new Headers({
					"cf-connecting-ip": "2.2.2.2",
					"x-forwarded-for": "1.1.1.1",
				}),
			),
		).toBe("2.2.2.2");
		expect(clientIp(new Headers())).toBe("unknown");
	});
});
