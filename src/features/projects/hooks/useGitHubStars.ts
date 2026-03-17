// src/features/projects/useGitHubStars.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import type { GitHubRepo } from "@/app/api/github/route";
import type { ApiResponse } from "@/types/api";

async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
	const res = await fetch("/api/github");
	const data: ApiResponse<GitHubRepo[]> = await res.json();
	return data.success && data.data ? data.data : [];
}

export function useGitHubStars() {
	const { data: repos = [] } = useQuery({
		queryKey: ["github", "repos"],
		queryFn: fetchGitHubRepos,
		// Refresh every hour — matches server cache TTL
		staleTime: 60 * 60 * 1000,
		retry: false,
	});

	// Map repo name → star count
	const starMap = repos.reduce<Record<string, number>>((acc, repo) => {
		acc[repo.name] = repo.stargazers_count;
		return acc;
	}, {});

	const getStars = (repoName: string, fallback: number): number => {
		return starMap[repoName] ?? fallback;
	};

	return { getStars, repos };
}
