import { expect, test } from "@playwright/test";

test("home has the name in the title, canonical and hreflang", async ({
	request,
}) => {
	const html = await (await request.get("/en")).text();
	expect(html).toMatch(/<title>[^<]*Agus Darmawan/);
	expect(html).toMatch(/rel="canonical" href="[^"]+\/en"/);
	expect(html).toMatch(/hreflang="id"/i);
	expect(html).toContain('"@type":"Person"');
});

test("/about is a crawlable profile page", async ({ request }) => {
	const res = await request.get("/en/about");
	expect(res.status()).toBe(200);
	const html = await res.text();
	expect(html).toContain('"@type":"ProfilePage"');
	expect(html).toMatch(/<h1[^>]*>/);
});

test("unknown pages 404 and are noindex", async ({ request }) => {
	const res = await request.get("/en/definitely-not-a-page");
	expect(res.status()).toBe(404);
	expect(await res.text()).toMatch(/name="robots" content="noindex/);
});

test("sitemap and robots are served", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).toContain("/en/about");
	expect(sitemap).toMatch(/hreflang="id"/i);
	expect((await request.get("/robots.txt")).status()).toBe(200);
});
