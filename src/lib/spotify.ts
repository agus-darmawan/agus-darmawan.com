import "server-only";
import type { SpotifyTrack } from "@/features/top-bar/types/spotify.types";
import { axiosSpotifyAccounts, axiosSpotifyAPI } from "./axios";
import { env, isSpotifyConfigured } from "./env";

let accessToken: string | null = null;
let tokenExpiry = 0;

async function refreshAccessToken(): Promise<string> {
	const response = await axiosSpotifyAccounts.post<{
		access_token: string;
		expires_in: number;
	}>(
		"/api/token",
		new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: env.SPOTIFY_REFRESH_TOKEN ?? "",
		}),
		{
			headers: {
				Authorization: `Basic ${Buffer.from(
					`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
				).toString("base64")}`,
			},
		},
	);

	const token = response.data.access_token;
	accessToken = token;
	tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60_000;
	return token;
}

async function getSpotifyAccessToken(): Promise<string> {
	if (accessToken && Date.now() < tokenExpiry) return accessToken;
	return refreshAccessToken();
}

interface SpotifyNowPlayingResponse {
	currently_playing_type: "track" | "episode" | "ad" | "unknown";
	// `item` is null for ads / private sessions and has no `album` for podcasts
	item: {
		name: string;
		duration_ms: number;
		album?: { name: string; images: { url: string }[] };
		artists?: { name: string }[];
	} | null;
	is_playing: boolean;
	progress_ms: number | null;
}

/** Returns `null` when nothing (displayable) is playing or Spotify isn't configured. */
export async function getNowPlaying(): Promise<SpotifyTrack | null> {
	if (!isSpotifyConfigured) return null;

	const token = await getSpotifyAccessToken();

	const { data, status } = await axiosSpotifyAPI.get<SpotifyNowPlayingResponse>(
		"/me/player/currently-playing",
		{
			headers: { Authorization: `Bearer ${token}` },
			validateStatus: (s) => s === 200 || s === 204,
		},
	);

	if (
		status === 204 ||
		!data?.item ||
		data.currently_playing_type !== "track"
	) {
		return null;
	}

	const { item } = data;
	return {
		name: item.name,
		artist: item.artists?.map((a) => a.name).join(", ") ?? "",
		album: item.album?.name ?? "",
		albumArt: item.album?.images[0]?.url ?? "",
		isPlaying: data.is_playing,
		progress: data.progress_ms ?? 0,
		duration: item.duration_ms,
	};
}
