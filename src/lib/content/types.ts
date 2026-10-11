/**
 * Content model shared by server (loader, pages) and client (desktop windows).
 * Client-safe: no Node imports here.
 */

export type ContentKind = "project" | "blog";
export type ProjectCategory = "web" | "robotics" | "research";

interface BaseMeta {
	slug: string;
	locale: string;
	title: string;
	description: string;
	tags: string[];
	color: string;
	emoji: string;
	/** ISO date (YYYY-MM-DD) — required for posts, optional for projects. */
	date: string | null;
	readingTime: number;
}

export interface ProjectMeta extends BaseMeta {
	kind: "project";
	category: ProjectCategory;
	featured: boolean;
	order: number;
	/** `owner/name`, null when the code isn't public. */
	repo: string | null;
	repoUrl: string | null;
	demo: string | null;
	stars: number | null;
	forks: number | null;
	/** "local" = MDX in /content, "github" = auto-discovered via repo topic. */
	source: "local" | "github";
}

export interface BlogMeta extends BaseMeta {
	kind: "blog";
	date: string;
}

export type ContentMeta = ProjectMeta | BlogMeta;

export type WithBody<T extends ContentMeta> = T & { body: string };
