import { beforeEach, describe, expect, it, vi } from "vitest";

// GitHub is offline in tests — the loader must still work from MDX alone.
vi.mock("./github", async (importOriginal) => {
	const actual = await importOriginal<typeof import("./github")>();
	return {
		...actual,
		getRepo: vi.fn(async () => ({ status: "unknown" })),
		getPortfolioRepos: vi.fn(async () => []),
		getReadme: vi.fn(async () => null),
	};
});

import { absolutizeLinks, getPortfolioRepos, getRepo } from "./github";
import {
	categoryFromTopics,
	getPost,
	getPosts,
	getProject,
	getProjects,
	readingTime,
} from "./loader";

const repo = { full_name: "me/robot", default_branch: "main" };

describe("absolutizeLinks", () => {
	it("rewrites relative images to raw.githubusercontent", () => {
		expect(absolutizeLinks("![arch](./docs/arch.png)", repo)).toBe(
			"![arch](https://raw.githubusercontent.com/me/robot/main/docs/arch.png)",
		);
	});

	it("rewrites relative links to the GitHub blob view", () => {
		expect(absolutizeLinks("[setup](docs/SETUP.md)", repo)).toBe(
			"[setup](https://github.com/me/robot/blob/main/docs/SETUP.md)",
		);
	});

	it("leaves absolute, protocol and anchor links alone", () => {
		const md = "[a](https://x.dev) [b](mailto:a@b.c) [c](#usage)";
		expect(absolutizeLinks(md, repo)).toBe(md);
	});
});

describe("categoryFromTopics", () => {
	it("maps topics to a category", () => {
		expect(categoryFromTopics(["ros2", "python"])).toBe("robotics");
		expect(categoryFromTopics(["deep-learning"])).toBe("research");
		expect(categoryFromTopics(["nextjs"])).toBe("web");
		expect(categoryFromTopics()).toBe("web");
	});
});

describe("readingTime", () => {
	it("ignores fenced code and never returns 0", () => {
		expect(readingTime("hi")).toBe(1);
		expect(
			readingTime(
				`${"word ".repeat(400)}\n\`\`\`\n${"x ".repeat(5000)}\n\`\`\``,
			),
		).toBe(2);
	});
});

describe("content loader (real /content files)", () => {
	beforeEach(() => vi.clearAllMocks());

	it("loads every project in both locales with identical slugs", async () => {
		const en = await getProjects("en");
		const id = await getProjects("id");
		expect(en.length).toBeGreaterThan(0);
		expect(id.map((p) => p.slug)).toEqual(en.map((p) => p.slug));
		expect(getRepo).toHaveBeenCalled();
		expect(getPortfolioRepos).toHaveBeenCalled();
	});

	it("inherits shared fields from en and translates text for id", async () => {
		const en = await getProject("en", "asv-navigation");
		const id = await getProject("id", "asv-navigation");
		expect(en?.tags).toEqual(id?.tags);
		expect(en?.category).toBe("robotics");
		expect(id?.title).not.toBe(en?.title);
		expect(id?.body).not.toBe(en?.body);
	});

	it("puts featured projects first", async () => {
		const projects = await getProjects("en");
		const firstNonFeatured = projects.findIndex((p) => !p.featured);
		expect(projects.slice(firstNonFeatured).every((p) => !p.featured)).toBe(
			true,
		);
	});

	it("does not leak the H1 or frontmatter into bodies", async () => {
		const post = await getPost("en", "building-ubuntu-portfolio");
		expect(post?.body.startsWith("---")).toBe(false);
		expect(post?.body.startsWith("# ")).toBe(false);
	});

	it("sorts posts newest first and returns null for unknown slugs", async () => {
		const posts = await getPosts("en");
		const dates = posts.map((p) => p.date);
		expect([...dates].sort().reverse()).toEqual(dates);
		expect(await getPost("en", "nope")).toBeNull();
	});
});

describe("absolutizeLinks — README edge cases", () => {
	it("rewrites both the badge image and its outer link", () => {
		expect(absolutizeLinks("[![CI](./badge.svg)](./LICENSE)", repo)).toBe(
			"[![CI](https://raw.githubusercontent.com/me/robot/main/badge.svg)](https://github.com/me/robot/blob/main/LICENSE)",
		);
	});

	it("rewrites <img src> in raw HTML", () => {
		expect(absolutizeLinks('<img src="docs/a.png" width="200">', repo)).toBe(
			'<img src="https://raw.githubusercontent.com/me/robot/main/docs/a.png" width="200">',
		);
	});

	it("does not touch fenced code", () => {
		const md = "```md\n![x](./y.png)\n```";
		expect(absolutizeLinks(md, repo)).toBe(md);
	});
});

describe("localeOverride", () => {
	it("strips non-translatable keys from locale files", async () => {
		const { localeOverride } = await import("./schema");
		expect(
			localeOverride.parse({ title: "Judul", featured: false, repo: "x/y" }),
		).toEqual({ title: "Judul" });
	});
});
