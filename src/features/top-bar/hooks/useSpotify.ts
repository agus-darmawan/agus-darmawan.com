import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRefreshProgress } from "@/hooks/useRefreshProgress";
import type { ApiResponse } from "@/types/api";
import type { SpotifyTrack } from "../types/spotify.types";

const REFETCH_INTERVAL = 10_000;

async function fetchNowPlaying(): Promise<SpotifyTrack | null> {
	const SPOTIFY_URL =
		process.env.NEXT_PUBLIC_SPOTIFY_WORKER_URL ?? "/api/spotify";

	const res = await axios.get<ApiResponse<SpotifyTrack>>(SPOTIFY_URL);
	return res.data?.success ? (res.data.data ?? null) : null;
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
