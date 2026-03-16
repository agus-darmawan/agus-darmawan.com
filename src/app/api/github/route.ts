// src/app/api/github/route.ts
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";

export interface GitHubRepo {
	id: string;
	name: string;
	stargazers_count: number;
	forks_count: number;
}

// Cache in memory for 1 hour — GitHub API rate limit is 60 req/hour unauthenticated
let cache: { data: GitHubRepo[]; timestamp: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET() {
	try {
		// Return cached data if fresh
		if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
			return NextResponse.json<ApiResponse<GitHubRepo[]>>(
				{ success: true, data: cache.data },
				{
					headers: {
						"Cache-Control":
							"public, max-age=3600, stale-while-revalidate=86400",
					},
				},
			);
		}

		const headers: Record<string, string> = {
			Accept: "application/vnd.github.v3+json",
			"User-Agent": "agus-darmawan-portfolio",
		};

		// Optional auth token — increases rate limit from 60 to 5000 req/hour
		if (process.env.GITHUB_TOKEN) {
			headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
		}

		const res = await fetch(
			"https://api.github.com/users/agus-darmawan/repos?sort=updated&per_page=30",
			{ headers },
		);

		if (!res.ok) {
			throw new Error(`GitHub API error: ${res.status}`);
		}

		const repos: GitHubRepo[] = await res.json();

		// Cache the result
		cache = { data: repos, timestamp: Date.now() };

		return NextResponse.json<ApiResponse<GitHubRepo[]>>(
			{ success: true, data: repos },
			{
				headers: {
					"Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
				},
			},
		);
	} catch (error) {
		console.error("GitHub API error:", error);
		return NextResponse.json<ApiResponse<null>>(
			{ success: false, data: null, error: "Failed to fetch GitHub data" },
			{ status: 500 },
		);
	}
}
