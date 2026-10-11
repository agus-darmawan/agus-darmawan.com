import { describe, expect, it } from "vitest";
import { contactSchema } from "./schema";

const valid = { name: "Agus", email: "a@b.co", message: "Hi!" };

describe("contactSchema", () => {
	it("accepts and trims a valid message", () => {
		expect(contactSchema.parse({ ...valid, name: "  Agus " }).name).toBe(
			"Agus",
		);
	});

	it("rejects header-injection attempts", () => {
		expect(
			contactSchema.safeParse({ ...valid, name: "x\r\nBcc: a@b.co" }).success,
		).toBe(false);
		expect(
			contactSchema.safeParse({ ...valid, email: "me>,x@evil.com" }).success,
		).toBe(false);
	});

	it("caps message size", () => {
		expect(
			contactSchema.safeParse({ ...valid, message: "x".repeat(5_001) }).success,
		).toBe(false);
	});
});
