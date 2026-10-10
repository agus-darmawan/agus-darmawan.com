import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "./frontmatter";

describe("parseFrontmatter", () => {
	it("splits YAML frontmatter from the body", () => {
		const { data, content } = parseFrontmatter(
			'---\ntitle: "Hi"\ntags: ["a", "b"]\ndate: 2025-03-16\nfeatured: true\n---\n\nBody',
		);
		expect(data).toEqual({
			title: "Hi",
			tags: ["a", "b"],
			date: "2025-03-16",
			featured: true,
		});
		expect(content.trim()).toBe("Body");
	});

	it("returns the source untouched without frontmatter", () => {
		expect(parseFrontmatter("# Title")).toEqual({
			data: {},
			content: "# Title",
		});
	});

	it("handles CRLF and a BOM", () => {
		const { data } = parseFrontmatter("﻿---\r\ntitle: x\r\n---\r\nbody");
		expect(data).toEqual({ title: "x" });
	});

	it("rejects frontmatter that isn't a mapping", () => {
		expect(() => parseFrontmatter("---\n- a\n- b\n---\n")).toThrow(/mapping/);
	});

	it("surfaces YAML syntax errors", () => {
		expect(() => parseFrontmatter("---\ntitle: [unclosed\n---\n")).toThrow();
	});
});
