import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/fetch-json";
import type { ApiResponse } from "@/types/api";
import type { SpotifyTrack } from "@/types/spotify";

export const SPOTIFY_INTERVAL = 10_000;

async function fetchNowPlaying(): Promise<SpotifyTrack | null> {
	// `||` not `??`: an empty env var must fall back too (fetch("") would
	// request the current page).
	const url = process.env.NEXT_PUBLIC_SPOTIFY_WORKER_URL || "/api/spotify";
	const res = await fetchJson<ApiResponse<SpotifyTrack>>(url);
	return res.success ? (res.data ?? null) : null;
}

export function useSpotify() {
	const { data, dataUpdatedAt } = useQuery({
		queryKey: ["spotify", "now-playing"],
		queryFn: fetchNowPlaying,
		refetchInterval: SPOTIFY_INTERVAL,
		refetchOnWindowFocus: true,
		// Keep the previous track while re-fetching — no flash of empty.
		placeholderData: (prev) => prev,
		retry: false,
	});

	return {
		// A paused track isn't "now playing".
		track: data?.isPlaying ? data : null,
		updatedAt: dataUpdatedAt,
	};
}
