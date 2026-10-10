import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { routing } from "@/i18n/routing";
import {
	type GitHubRepo,
	getPortfolioRepos,
	getReadme,
	getRepo,
} from "./github";
import {
	blogFrontmatter,
	localeOverride,
	type ProjectFrontmatter,
	projectFrontmatter,
} from "./schema";
import type { BlogMeta, ProjectCategory, ProjectMeta, WithBody } from "./types";

/**
 * Content layer — the ONLY place that knows where projects/posts come from.
 *
 *   content/{projects|blog}/{locale}/{slug}.mdx   ← curated, translated
 *   + GitHub repo stats for projects with `repo:`  ← live stars/forks/homepage
 *   + public repos tagged `portfolio` with no MDX  ← auto-listed, README as body
 *
 * Adding a project = push a repo with the `portfolio` topic (zero code), or
 * drop an MDX file for a curated write-up. No TS data files, no i18n keys.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");
const DEFAULT_LOCALE = routing.defaultLocale;
const WORDS_PER_MINUTE = 200;

type Section = "projects" | "blog";

interface RawEntry {
	slug: string;
	data: Record<string, unknown>;
	body: string;
}

// ── fs helpers ────────────────────────────────────────────────────────────────

async function listSlugs(section: Section, locale: string): Promise<string[]> {
	try {
		const files = await readdir(path.join(CONTENT_DIR, section, locale));
		return files
			.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
			.map((f) => f.replace(/\.mdx?$/, ""))
			.sort();
	} catch {
		return [];
	}
}

async function readEntry(
	section: Section,
	locale: string,
	slug: string,
): Promise<RawEntry | null> {
	for (const ext of [".mdx", ".md"]) {
		try {
			const file = path.join(CONTENT_DIR, section, locale, `${slug}${ext}`);
			const source = await readFile(file, "utf8").catch((e: unknown) => {
				if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
				throw e;
			});
			if (source === null) continue; // try next extension
			// YAML errors must surface (fail the build), not silently drop the entry.
			const { data, content } = matter(source);
			return { slug, data, body: content.trim() };
		} catch (error) {
			fail(`${section}/${locale}/${slug}${ext}`, error);
		}
	}
	return null;
}

/** Default-locale file is the base; the locale file overrides text + body. */
async function readLocalized(section: Section, slug: string, locale: string) {
	const base = await readEntry(section, DEFAULT_LOCALE, slug);
	if (!base) return null;
	if (locale === DEFAULT_LOCALE) return base;

	const local = await readEntry(section, locale, slug);
	if (!local) return base;

	const parsed = localeOverride.safeParse(local.data);
	if (!parsed.success) fail(`${section}/${locale}/${slug}`, parsed.error);
	const override = parsed.data;
	return {
		slug,
		data: { ...base.data, ...override },
		body: local.body || base.body,
	};
}

function fail(file: string, error: unknown): never {
	throw new Error(`Invalid frontmatter in content/${file}:\n${String(error)}`);
}

export function readingTime(markdown: string): number {
	const words = markdown
		.replace(/```[\s\S]*?```/g, "")
		.split(/\s+/)
		.filter(Boolean).length;
	return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

// ── Projects ──────────────────────────────────────────────────────────────────

const CATEGORY_STYLE: Record<
	ProjectCategory,
	{ color: string; emoji: string }
> = {
	web: { color: "#3b82f6", emoji: "🌐" },
	robotics: { color: "#10b981", emoji: "🤖" },
	research: { color: "#8b5cf6", emoji: "🔬" },
};

const ROBOTICS_TOPICS = [
	"robotics",
	"ros",
	"ros2",
	"drone",
	"embedded",
	"slam",
];
const RESEARCH_TOPICS = [
	"research",
	"paper",
	"machine-learning",
	"deep-learning",
];

export function categoryFromTopics(topics: string[] = []): ProjectCategory {
	if (topics.some((t) => ROBOTICS_TOPICS.includes(t))) return "robotics";
	if (topics.some((t) => RESEARCH_TOPICS.includes(t))) return "research";
	return "web";
}

function humanize(repoName: string): string {
	return repoName
		.replace(/[-_]+/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

function projectFromMdx(
	entry: RawEntry,
	locale: string,
	fm: ProjectFrontmatter,
	repo: GitHubRepo | null,
	repoMissing: boolean,
): WithBody<ProjectMeta> {
	return {
		kind: "project",
		source: "local",
		slug: entry.slug,
		locale,
		title: fm.title,
		description: fm.description,
		tags: fm.tags,
		color: fm.color,
		emoji: fm.emoji,
		date: fm.date ?? null,
		category: fm.category,
		featured: fm.featured,
		order: fm.order,
		repo: repoMissing ? null : (fm.repo ?? null),
		repoUrl: repoMissing || !fm.repo ? null : `https://github.com/${fm.repo}`,
		demo: fm.demo ?? repo?.homepage ?? null,
		stars: repo?.stargazers_count ?? null,
		forks: repo?.forks_count ?? null,
		readingTime: readingTime(entry.body),
		body: entry.body,
	};
}

function projectFromRepo(
	repo: GitHubRepo,
	locale: string,
	readme: string | null,
): WithBody<ProjectMeta> {
	const topics = repo.topics ?? [];
	const category = categoryFromTopics(topics);
	const description = repo.description ?? humanize(repo.name);
	// The page renders the title as <h1>; drop the README's own leading H1.
	const body = readme
		? readme.replace(/^\s*#\s+.*\n+/, "")
		: `${description}\n\n[View on GitHub](${repo.html_url})`;
	return {
		kind: "project",
		source: "github",
		slug: repo.name.toLowerCase(),
		locale,
		title: humanize(repo.name),
		description,
		tags: [
			...(repo.language ? [repo.language] : []),
			...topics.filter((t) => t !== "portfolio" && t !== "featured"),
		].slice(0, 8),
		...CATEGORY_STYLE[category],
		date: repo.created_at.slice(0, 10),
		category,
		featured: topics.includes("featured"),
		order: 1000,
		repo: repo.full_name,
		repoUrl: repo.html_url,
		demo: repo.homepage || null,
		stars: repo.stargazers_count,
		forks: repo.forks_count,
		readingTime: readingTime(body),
		body,
	};
}

const sortProjects = (a: ProjectMeta, b: ProjectMeta) =>
	Number(b.featured) - Number(a.featured) ||
	a.order - b.order ||
	(b.stars ?? 0) - (a.stars ?? 0) ||
	a.title.localeCompare(b.title);

/** All projects for a locale, with bodies. Memoized per request. */
export const getProjectsWithBody = cache(
	async (locale: string): Promise<WithBody<ProjectMeta>[]> => {
		const slugs = await listSlugs("projects", DEFAULT_LOCALE);

		const local = (
			await Promise.all(
				slugs.map(async (slug) => {
					const entry = await readLocalized("projects", slug, locale);
					if (!entry) return null;
					const parsed = projectFrontmatter.safeParse(entry.data);
					if (!parsed.success) fail(`projects/${slug}`, parsed.error);
					if (parsed.data.draft) return null;

					const lookup = parsed.data.repo
						? await getRepo(parsed.data.repo)
						: ({ status: "unknown" } as const);
					return projectFromMdx(
						entry,
						locale,
						parsed.data,
						lookup.status === "ok" ? lookup.repo : null,
						lookup.status === "missing",
					);
				}),
			)
		).filter((p) => p !== null);

		// Auto-discover repos tagged `portfolio` that don't have an MDX write-up.
		const curated = new Set(
			local.flatMap((p) => [p.slug, p.repo?.toLowerCase()].filter(Boolean)),
		);
		const discovered = await Promise.all(
			(await getPortfolioRepos())
				.filter(
					(r) =>
						!curated.has(r.full_name.toLowerCase()) &&
						!curated.has(r.name.toLowerCase()),
				)
				.map(async (r) => projectFromRepo(r, locale, await getReadme(r))),
		);

		return [...local, ...discovered].sort(sortProjects);
	},
);

export async function getProjects(locale: string): Promise<ProjectMeta[]> {
	return (await getProjectsWithBody(locale)).map(
		({ body: _, ...meta }) => meta,
	);
}

export async function getProject(locale: string, slug: string) {
	return (
		(await getProjectsWithBody(locale)).find((p) => p.slug === slug) ?? null
	);
}

// ── Blog ──────────────────────────────────────────────────────────────────────

export const getPostsWithBody = cache(
	async (locale: string): Promise<WithBody<BlogMeta>[]> => {
		const slugs = await listSlugs("blog", DEFAULT_LOCALE);
		const posts = await Promise.all(
			slugs.map(async (slug) => {
				const entry = await readLocalized("blog", slug, locale);
				if (!entry) return null;
				const parsed = blogFrontmatter.safeParse(entry.data);
				if (!parsed.success) fail(`blog/${slug}`, parsed.error);
				if (parsed.data.draft) return null;
				const fm = parsed.data;
				return {
					kind: "blog",
					slug,
					locale,
					title: fm.title,
					description: fm.description,
					tags: fm.tags,
					color: fm.color,
					emoji: fm.emoji,
					date: fm.date,
					readingTime: readingTime(entry.body),
					body: entry.body,
				} satisfies WithBody<BlogMeta>;
			}),
		);
		return posts
			.filter((p) => p !== null)
			.sort((a, b) => b.date.localeCompare(a.date));
	},
);

export async function getPosts(locale: string): Promise<BlogMeta[]> {
	return (await getPostsWithBody(locale)).map(({ body: _, ...meta }) => meta);
}

export async function getPost(locale: string, slug: string) {
	return (await getPostsWithBody(locale)).find((p) => p.slug === slug) ?? null;
}
