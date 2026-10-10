import { useQuery } from "@tanstack/react-query";
import { useRefreshProgress } from "@/hooks/useRefreshProgress";
import { fetchJson } from "@/lib/fetch-json";
import type { ApiResponse } from "@/types/api";
import type { SpotifyTrack } from "../types/spotify.types";

const REFETCH_INTERVAL = 10_000;

async function fetchNowPlaying(): Promise<SpotifyTrack | null> {
	// `||` not `??`: an empty env var must fall back too (fetch("") would
	// request the current page).
	const url = process.env.NEXT_PUBLIC_SPOTIFY_WORKER_URL || "/api/spotify";
	const res = await fetchJson<ApiResponse<SpotifyTrack>>(url);
	return res.success ? (res.data ?? null) : null;
}

export interface UseSpotifyResult {
	track: SpotifyTrack | null;
	/** Smooth 0→1 arc progress toward next refetch */
	refreshProgress: number;
	isLoading: boolean;
	isFetching: boolean;
}

export function useSpotify(): UseSpotifyResult {
	const { data, isLoading, isFetching, dataUpdatedAt } = useQuery({
		queryKey: ["spotify", "now-playing"],
		queryFn: fetchNowPlaying,
		refetchInterval: REFETCH_INTERVAL,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: true,
		// Keep previous track visible while re-fetching — no flash of empty
		placeholderData: (prev) => prev,
		retry: false,
	});

	const refreshProgress = useRefreshProgress(dataUpdatedAt, REFETCH_INTERVAL);

	return {
		track: data ?? null,
		refreshProgress,
		isLoading,
		isFetching,
	};
}
