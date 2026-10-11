import { describe, expect, it } from "vitest";
import { desktopHref, parseDeepLink, websitePath } from "./desktop-links";

describe("desktopHref", () => {
	it("opens the matching window for a website page", () => {
		expect(desktopHref("/about")).toEqual({
			pathname: "/desktop",
			query: { open: "about" },
		});
		expect(desktopHref("/experience").query).toEqual({ open: "experience" });
	});

	it("opens a project or post inside its window", () => {
		expect(desktopHref("/projects/quadruped-inspection").query).toEqual({
			open: "projects",
			item: "quadruped-inspection",
		});
		expect(desktopHref("/blog/agus-darmawan.com").query).toEqual({
			open: "blog",
			item: "agus-darmawan.com",
		});
	});

	it("falls back to the plain desktop", () => {
		expect(desktopHref("/")).toEqual({ pathname: "/desktop" });
		expect(desktopHref("/not-a-page")).toEqual({ pathname: "/desktop" });
		expect(desktopHref("/about/extra").query).toEqual({ open: "about" });
	});
});

describe("parseDeepLink", () => {
	it("reads the app and item", () => {
		expect(parseDeepLink("?open=projects&item=asv-navigation")).toEqual({
			app: "projects",
			item: "asv-navigation",
		});
		expect(parseDeepLink("?open=terminal")).toEqual({ app: "terminal" });
	});

	it("ignores unknown apps, items on apps without items and odd slugs", () => {
		expect(parseDeepLink("")).toBeNull();
		expect(parseDeepLink("?open=__proto__")).toBeNull();
		expect(parseDeepLink("?open=about&item=x")).toEqual({ app: "about" });
		expect(parseDeepLink("?open=blog&item=../secret")).toEqual({
			app: "blog",
		});
	});
});

describe("websitePath", () => {
	it("maps windows back to pages", () => {
		expect(websitePath("contact")).toBe("/contact");
		expect(websitePath("blog", "hello-world")).toBe("/blog/hello-world");
		expect(websitePath("projects", null)).toBe("/projects");
	});

	it("sends apps without a page somewhere sensible", () => {
		expect(websitePath("resume")).toBe("/about");
		expect(websitePath("terminal")).toBe("/");
		expect(websitePath(null)).toBe("/");
		expect(websitePath("about", "ignored")).toBe("/about");
	});

	it("round-trips with desktopHref", () => {
		for (const path of ["/about", "/projects", "/projects/a-b", "/blog/x"]) {
			const { query } = desktopHref(path);
			expect(websitePath(query?.open, query?.item)).toBe(path);
		}
	});
});
