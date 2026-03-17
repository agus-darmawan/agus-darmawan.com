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
		staleTime: 60 * 60 * 1000,
		retry: false,
	});

	const starMap = repos.reduce<Record<string, number>>((acc, repo) => {
		acc[repo.name] = repo.stargazers_count;
		return acc;
	}, {});

	const forkMap = repos.reduce<Record<string, number>>((acc, repo) => {
		acc[repo.name] = repo.forks_count;
		return acc;
	}, {});

	const getStars = (repoName: string, fallback: number): number =>
		starMap[repoName] ?? fallback;

	const getForks = (repoName: string): number => forkMap[repoName] ?? 0;

	return { getStars, getForks, repos };
}
