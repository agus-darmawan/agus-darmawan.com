import { parse } from "yaml";

const FRONTMATTER = /^﻿?---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

/**
 * Split `---` YAML frontmatter from a Markdown/MDX source.
 * (Replaces gray-matter, whose js-yaml 3 dependency chain carries open
 * advisories and is no longer maintained.)
 */
export function parseFrontmatter(source: string): {
	data: Record<string, unknown>;
	content: string;
} {
	const match = FRONTMATTER.exec(source);
	if (!match) return { data: {}, content: source };

	const data: unknown = parse(match[1]) ?? {};
	if (typeof data !== "object" || Array.isArray(data)) {
		throw new Error("Frontmatter must be a YAML mapping (key: value)");
	}
	return {
		data: data as Record<string, unknown>,
		content: source.slice(match[0].length),
	};
}
