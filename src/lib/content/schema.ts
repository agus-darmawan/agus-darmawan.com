import { z } from "zod";

/**
 * Frontmatter contract for /content. Invalid content fails the build with a
 * readable error instead of rendering `undefined` in production.
 *
 * Locale files only need `title` + `description`; everything else is
 * inherited from the default-locale (en) file.
 */

const isoDate = z
	.union([z.date(), z.string()])
	.transform((v) => (v instanceof Date ? v : new Date(v)))
	.refine((d) => !Number.isNaN(d.getTime()), "Invalid date")
	.transform((d) => d.toISOString().slice(0, 10));

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Expected #rrggbb");

const shared = {
	title: z.string().min(1),
	description: z.string().min(1).max(300),
	tags: z.array(z.string()).default([]),
	emoji: z.string().default("📄"),
	color: hexColor.default("#e95420"),
};

export const projectFrontmatter = z.object({
	...shared,
	date: isoDate.optional(),
	category: z.enum(["web", "robotics", "research"]).default("web"),
	featured: z.boolean().default(false),
	order: z.number().int().default(100),
	repo: z
		.string()
		.regex(/^[\w.-]+\/[\w.-]+$/, "Expected owner/name")
		.optional(),
	demo: z.url().optional(),
	draft: z.boolean().default(false),
});

export const blogFrontmatter = z.object({
	...shared,
	date: isoDate,
	draft: z.boolean().default(false),
});

/** Locale override file — only translatable fields. */
export const localeOverride = z
	.object({
		title: z.string().min(1).optional(),
		description: z.string().min(1).max(300).optional(),
		tags: z.array(z.string()).optional(),
	})
	.loose();

export type ProjectFrontmatter = z.infer<typeof projectFrontmatter>;
export type BlogFrontmatter = z.infer<typeof blogFrontmatter>;
