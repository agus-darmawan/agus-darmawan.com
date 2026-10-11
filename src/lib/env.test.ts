import { afterEach, describe, expect, it, vi } from "vitest";

describe("env", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.resetModules();
	});

	it("falls back to the site email when CONTACT_EMAIL is empty", async () => {
		vi.stubEnv("CONTACT_EMAIL", "");
		const { env } = await import("./env");
		expect(env.CONTACT_EMAIL).toBe("darmawandeveloper@gmail.com");
	});

	it("parses SMTP_SECURE=false as false", async () => {
		vi.stubEnv("SMTP_SECURE", "false");
		const { env } = await import("./env");
		expect(env.SMTP_SECURE).toBe(false);
	});
});
