import { describe, expect, it } from "vitest";
import { highlight } from "./highlight";

const strip = (html: string) =>
	html
		.replace(/<[^>]+>/g, "")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, "&");

describe("highlight", () => {
	it("round-trips the source text exactly", () => {
		const src = `// say "hi"\nconst a = "x"; /* <b> */ if (a < 2) return <App />;`;
		expect(strip(highlight(src, "tsx"))).toBe(src);
	});

	it("does not nest spans when a comment precedes a string (old bug)", () => {
		const html = highlight(`// c\nconst s = "x";`, "ts");
		expect(html).not.toMatch(/<span[^>]*<span/);
		expect(html.match(/<span/g)?.length).toBe(3); // comment, const, "x"
	});

	it("escapes HTML for unknown languages", () => {
		expect(highlight("<script>", "text")).toBe("&lt;script&gt;");
	});

	it("supports python comments and keywords", () => {
		const html = highlight("def f(): # note", "python");
		expect(html).toContain('<span style="color:#ff79c6">def</span>');
		expect(html).toContain('<span style="color:#6272a4"># note</span>');
	});
});
