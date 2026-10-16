import { NextRequest } from "next/server";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

// Offline: the content loader must work from MDX alone.
vi.mock("@/lib/content/github", async (importOriginal) => ({
	...(await importOriginal<typeof import("@/lib/content/github")>()),
	getRepo: vi.fn(async () => ({ status: "unknown" })),
	getPortfolioRepos: vi.fn(async () => []),
	getReadme: vi.fn(async () => null),
}));

import { getMetaStore, memoryStore } from "./store";

describe("memory store", () => {
	it("counts a visitor's view once a day", async () => {
		let now = 0;
		const store = memoryStore(() => now);
		expect((await store.view("project:a", "v1")).views).toBe(1);
		expect((await store.view("project:a", "v1")).views).toBe(1);
		expect((await store.view("project:a", "v2")).views).toBe(2);
		now += 24 * 60 * 60 * 1000 + 1;
		expect((await store.view("project:a", "v1")).views).toBe(3);
	});

	it("likes and unlikes, per visitor", async () => {
		const store = memoryStore();
		await store.like("blog:b", "v1", true);
		await store.like("blog:b", "v1", true);
		expect(await store.like("blog:b", "v2", true)).toEqual({
			views: 0,
			likes: 2,
			liked: true,
		});
		await store.like("blog:b", "v1", false);
		const [mine, anonymous] = [
			...(await store.counts(["blog:b"], "v1")),
			...(await store.counts(["blog:b"], null)),
		];
		expect(mine).toEqual({ views: 0, likes: 1, liked: false });
		expect(anonymous.liked).toBe(false);
	});
});

describe("Upstash store", () => {
	afterEach(() => vi.unstubAllGlobals());

	const config = {
		UPSTASH_REDIS_REST_URL: "https://redis.example/",
		UPSTASH_REDIS_REST_TOKEN: "secret",
	} as const;

	it("is off without a URL and token", () => {
		expect(getMetaStore({})).toBeNull();
		expect(getMetaStore({ UPSTASH_REDIS_REST_URL: "https://x" })).toBeNull();
		expect(getMetaStore({ META_STORE: "memory" })).not.toBeNull();
	});

	it("reads every item in one pipeline", async () => {
		const fetch = vi.fn(async () =>
			Response.json([
				{ result: "12" },
				{ result: 3 },
				{ result: 1 },
				{ result: null },
				{ result: 0 },
				{ result: 0 },
			]),
		);
		vi.stubGlobal("fetch", fetch);

		const store = getMetaStore(config);
		const counts = await store?.counts(["project:a", "blog:b"], "v1");
		expect(counts).toEqual([
			{ views: 12, likes: 3, liked: true },
			{ views: 0, likes: 0, liked: false },
		]);
		const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
		expect(url).toBe("https://redis.example/pipeline");
		expect(new Headers(init.headers).get("authorization")).toBe(
			"Bearer secret",
		);
		expect(JSON.parse(String(init.body))).toEqual([
			["GET", "meta:project:a:views"],
			["SCARD", "meta:project:a:likes"],
			["SISMEMBER", "meta:project:a:likes", "v1"],
			["GET", "meta:blog:b:views"],
			["SCARD", "meta:blog:b:likes"],
			["SISMEMBER", "meta:blog:b:likes", "v1"],
		]);
	});

	it("dedupes views in Redis with a one-day key", async () => {
		const fetch = vi.fn(async () =>
			Response.json([{ result: 7 }, { result: 2 }, { result: 0 }]),
		);
		vi.stubGlobal("fetch", fetch);

		expect(await getMetaStore(config)?.view("blog:b", "v1")).toEqual({
			views: 7,
			likes: 2,
			liked: false,
		});
		const [, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
		const [evaluate] = JSON.parse(String(init.body));
		expect(evaluate.slice(2)).toEqual([
			2,
			"meta:blog:b:seen:v1",
			"meta:blog:b:views",
			86400,
		]);
	});

	it("fails loudly when Redis answers with an error", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => Response.json([{ error: "WRONGTYPE" }])),
		);
		await expect(
			getMetaStore(config)?.counts(["blog:b"], null),
		).rejects.toThrow("WRONGTYPE");
	});
});

describe("views and likes routes (memory store)", () => {
	let routes: {
		get: typeof import("@/app/api/meta/route").GET;
		view: typeof import("@/app/api/meta/view/route").POST;
		like: typeof import("@/app/api/meta/like/route").POST;
	};

	beforeAll(async () => {
		vi.stubEnv("META_STORE", "memory");
		vi.resetModules();
		routes = {
			get: (await import("@/app/api/meta/route")).GET,
			view: (await import("@/app/api/meta/view/route")).POST,
			like: (await import("@/app/api/meta/like/route")).POST,
		};
	});

	const post = (path: string, body: unknown, headers: HeadersInit = {}) =>
		new NextRequest(`http://localhost${path}`, {
			method: "POST",
			headers: { "content-type": "application/json", ...headers },
			body: JSON.stringify(body),
		});

	it("counts a view once and remembers the visitor in a cookie", async () => {
		const first = await routes.view(
			post("/api/meta/view", { item: "project:pashupati" }),
		);
		expect(first.status).toBe(200);
		const cookie = first.headers.get("set-cookie") ?? "";
		expect(cookie).toMatch(/^vid=[\w-]+;.*HttpOnly/i);
		expect((await first.json()).data).toEqual({
			views: 1,
			likes: 0,
			liked: false,
		});

		const id = cookie.split(";")[0];
		const again = await routes.view(
			post("/api/meta/view", { item: "project:pashupati" }, { cookie: id }),
		);
		expect((await again.json()).data.views).toBe(1);
		expect(again.headers.get("set-cookie")).toBeNull();
		expect(again.headers.get("cache-control")).toContain("no-store");
	});

	it("likes, and reports it back to the same visitor only", async () => {
		const res = await routes.like(
			post("/api/meta/like", {
				item: "blog:building-ubuntu-portfolio",
				liked: true,
			}),
		);
		const id = (res.headers.get("set-cookie") ?? "").split(";")[0];
		expect((await res.json()).data).toMatchObject({ likes: 1, liked: true });

		const items = "blog:building-ubuntu-portfolio,project:pashupati,blog:nope";
		const mine = await routes.get(
			new NextRequest(`http://localhost/api/meta?items=${items}`, {
				headers: { cookie: id },
			}),
		);
		const data = (await mine.json()).data;
		expect(Object.keys(data)).toEqual([
			"blog:building-ubuntu-portfolio",
			"project:pashupati",
		]);
		expect(data["blog:building-ubuntu-portfolio"]).toEqual({
			views: 0,
			likes: 1,
			liked: true,
		});

		const theirs = await routes.get(
			new NextRequest(`http://localhost/api/meta?items=${items}`),
		);
		expect(
			(await theirs.json()).data["blog:building-ubuntu-portfolio"].liked,
		).toBe(false);
	});

	it("doesn't count crawlers", async () => {
		const res = await routes.view(
			post(
				"/api/meta/view",
				{ item: "project:asv-navigation" },
				{ "user-agent": "Googlebot/2.1" },
			),
		);
		expect((await res.json()).data.views).toBe(0);
	});

	it("refuses unknown items, other sites, non-JSON bodies and bad input", async () => {
		expect(
			(await routes.view(post("/api/meta/view", { item: "project:nope" })))
				.status,
		).toBe(404);
		expect(
			(await routes.view(post("/api/meta/view", { item: "../etc" }))).status,
		).toBe(404);
		expect(
			(
				await routes.view(
					post(
						"/api/meta/view",
						{ item: "project:pashupati" },
						{ "sec-fetch-site": "cross-site" },
					),
				)
			).status,
		).toBe(403);
		expect(
			(
				await routes.view(
					post(
						"/api/meta/view",
						{ item: "project:pashupati" },
						{ "content-type": "text/plain" },
					),
				)
			).status,
		).toBe(415);
		expect(
			(
				await routes.like(
					post("/api/meta/like", { item: "project:pashupati", liked: "yes" }),
				)
			).status,
		).toBe(400);
	});
});
