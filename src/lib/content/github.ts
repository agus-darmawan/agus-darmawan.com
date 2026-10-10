import "server-only";
import { SITE } from "@/config/site";
import { env } from "@/lib/env";

/**
 * Thin GitHub REST client for the content layer.
 *
 * - Cached with Next's data cache (`revalidate`), so the API is hit at most
 *   once per hour per URL — no more in-memory module cache that resets on
 *   every serverless cold start.
 * - Never throws: GitHub being down/rate-limited must not break the build
 *   or a page render. Callers get `null` / `[]` and fall back to MDX data.
 */

const API = "https://api.github.com";
const REVALIDATE_SECONDS = 60 * 60;
const TIMEOUT_MS = 6_000;

export interface GitHubRepo {
	name: string;
	full_name: string;
	html_url: string;
	description: string | null;
	homepage: string | null;
	language: string | null;
	topics?: string[];
	stargazers_count: number;
	forks_count: number;
	fork: boolean;
	archived: boolean;
	private: boolean;
	default_branch: string;
	created_at: string;
	pushed_at: string;
}

/** `missing` = GitHub answered 404 (private/renamed/deleted), so don't link it. */
type RepoLookup =
	| { status: "ok"; repo: GitHubRepo }
	| { status: "missing" }
	| { status: "unknown" };

function headers(accept = "application/vnd.github+json") {
	const h: Record<string, string> = {
		Accept: accept,
		"User-Agent": `${SITE.github.username}-portfolio`,
		"X-GitHub-Api-Version": "2022-11-28",
	};
	if (env.GITHUB_TOKEN) h.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
	return h;
}

async function gh(path: string, accept?: string): Promise<Response | null> {
	try {
		return await fetch(`${API}${path}`, {
			headers: headers(accept),
			next: { revalidate: REVALIDATE_SECONDS, tags: ["github"] },
			signal: AbortSignal.timeout(TIMEOUT_MS),
		});
	} catch {
		return null;
	}
}

export async function getRepo(fullName: string): Promise<RepoLookup> {
	const res = await gh(`/repos/${fullName}`);
	if (!res) return { status: "unknown" };
	if (res.status === 404) return { status: "missing" };
	if (!res.ok) return { status: "unknown" };
	return { status: "ok", repo: (await res.json()) as GitHubRepo };
}

/** Public, non-fork, non-archived repos tagged with the portfolio topic. */
export async function getPortfolioRepos(): Promise<GitHubRepo[]> {
	const res = await gh(
		`/users/${SITE.github.username}/repos?per_page=100&sort=pushed&type=owner`,
	);
	if (!res?.ok) return [];
	const repos = (await res.json()) as GitHubRepo[];
	return repos.filter(
		(r) =>
			!r.fork &&
			!r.archived &&
			!r.private &&
			r.topics?.includes(SITE.github.portfolioTopic),
	);
}

/** README as raw markdown with relative links rewritten to absolute URLs. */
export async function getReadme(repo: GitHubRepo): Promise<string | null> {
	const res = await gh(
		`/repos/${repo.full_name}/readme`,
		"application/vnd.github.raw+json",
	);
	if (!res?.ok) return null;
	return absolutizeLinks(await res.text(), repo);
}

/**
 * GitHub READMEs use repo-relative paths (`./docs/arch.png`). Outside GitHub
 * those 404, so point images at raw.githubusercontent and links at the blob.
 */
export function absolutizeLinks(
	markdown: string,
	repo: Pick<GitHubRepo, "full_name" | "default_branch">,
): string {
	const raw = `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/`;
	const blob = `https://github.com/${repo.full_name}/blob/${repo.default_branch}/`;
	const isRelative = (url: string) =>
		!/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url);
	const resolve = (base: string, url: string) =>
		isRelative(url) ? `${base}${url.replace(/^\.?\//, "")}` : url;

	const rewrite = (text: string) =>
		text
			// 1) images first: ![alt](src "title")
			.replace(
				/!\[([^\]]*)\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g,
				(_, alt: string, url: string, title: string) =>
					`![${alt}](${resolve(raw, url)}${title})`,
			)
			// 2) links whose label may itself be an image (badges): [![…](…)](href)
			.replace(
				/(?<!!)\[((?:[^[\]]|\[[^\]]*\])*)\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g,
				(_, label: string, url: string, title: string) =>
					`[${label}](${resolve(blob, url)}${title})`,
			)
			// 3) <img src="…"> in raw HTML
			.replace(
				/(<img\b[^>]*\bsrc\s*=\s*["'])([^"']+)(["'])/gi,
				(_, pre: string, url: string, post: string) =>
					`${pre}${resolve(raw, url)}${post}`,
			);

	// Leave fenced code untouched.
	return markdown
		.split(/(^```[\s\S]*?^```)/m)
		.map((chunk) => (chunk.startsWith("```") ? chunk : rewrite(chunk)))
		.join("");
}
