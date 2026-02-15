import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ApiResponse } from "@/types/api";
import type { SpotifyTrack } from "@/types/spotify";

const REFETCH_INTERVAL = 10_000;

async function fetchNowPlaying(): Promise<SpotifyTrack | null> {
	const res = await axios.get<ApiResponse<SpotifyTrack>>("/api/spotify");
	return res.data?.success ? (res.data.data ?? null) : null;
}

interface UseSpotifyResult {
	track: SpotifyTrack | null;
	/** 0 = just fetched → 1 = about to fetch again */
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
		// Keep the previous track visible while re-fetching (no flash of empty)
		placeholderData: (prev) => prev,
		retry: false,
	});

	const elapsed = dataUpdatedAt ? Date.now() - dataUpdatedAt : 0;
	const refreshProgress = Math.min(elapsed / REFETCH_INTERVAL, 1);

	return {
		track: data ?? null,
		refreshProgress,
		isLoading,
		isFetching,
	};
}
