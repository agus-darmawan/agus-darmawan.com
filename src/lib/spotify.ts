import "server-only";
import type { SpotifyTrack } from "@/types/spotify";
import { env, isSpotifyConfigured } from "./env";
import { fetchJson } from "./fetch-json";

const ACCOUNTS_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL =
	"https://api.spotify.com/v1/me/player/currently-playing";

let accessToken: string | null = null;
let tokenExpiry = 0;

async function refreshAccessToken(): Promise<string> {
	const credentials = Buffer.from(
		`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
	).toString("base64");

	const data = await fetchJson<{ access_token: string; expires_in: number }>(
		ACCOUNTS_URL,
		{
			method: "POST",
			headers: {
				Authorization: `Basic ${credentials}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: env.SPOTIFY_REFRESH_TOKEN ?? "",
			}),
		},
	);

	accessToken = data.access_token;
	// Refresh a minute early so a request never races the expiry.
	tokenExpiry = Date.now() + data.expires_in * 1000 - 60_000;
	return data.access_token;
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
	const res = await fetch(NOW_PLAYING_URL, {
		headers: { Authorization: `Bearer ${token}` },
		cache: "no-store",
		signal: AbortSignal.timeout(10_000),
	});

	// 204 = nothing playing
	if (res.status === 204) return null;
	if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);

	const data = (await res.json()) as SpotifyNowPlayingResponse;
	if (!data.item || data.currently_playing_type !== "track") return null;

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
