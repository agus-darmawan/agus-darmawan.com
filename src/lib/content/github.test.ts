import { afterEach, describe, expect, it, vi } from "vitest";
import { getRepo } from "./github";

const repo = (overrides: Record<string, unknown> = {}) => ({
	name: "robot",
	full_name: "me/robot",
	html_url: "https://github.com/me/robot",
	private: false,
	stargazers_count: 3,
	...overrides,
});

const answer = (status: number, body: unknown = {}) =>
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response(JSON.stringify(body), { status })),
	);

afterEach(() => vi.unstubAllGlobals());

describe("getRepo", () => {
	it("returns a public repo", async () => {
		answer(200, repo());
		expect(await getRepo("me/robot")).toMatchObject({
			status: "ok",
			repo: { full_name: "me/robot", stargazers_count: 3 },
		});
	});

	it("treats a private repo as missing, even when the token can see it", async () => {
		answer(200, repo({ private: true }));
		expect(await getRepo("me/robot")).toEqual({ status: "missing" });
	});

	it("treats a 404 as missing and other failures as unknown", async () => {
		answer(404);
		expect(await getRepo("me/gone")).toEqual({ status: "missing" });
		answer(503);
		expect(await getRepo("me/robot")).toEqual({ status: "unknown" });
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => {
				throw new Error("offline");
			}),
		);
		expect(await getRepo("me/robot")).toEqual({ status: "unknown" });
	});
});
