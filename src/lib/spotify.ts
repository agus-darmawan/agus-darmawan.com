import { axiosSpotifyAccounts, axiosSpotifyAPI } from "./axios";
import { env } from "./env";

let accessToken: string | null = null;
let tokenExpiry = 0;

async function refreshAccessToken(): Promise<string> {
	const response = await axiosSpotifyAccounts.post(
		"/api/token",
		new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: env.SPOTIFY_REFRESH_TOKEN,
		}),
		{
			headers: {
				Authorization:
					"Basic " +
					Buffer.from(
						`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
					).toString("base64"),
			},
		},
	);

	accessToken = response.data.access_token;
	tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60_000;

	return accessToken!;
}

export async function getSpotifyAccessToken() {
	if (accessToken && Date.now() < tokenExpiry) {
		return accessToken;
	}
	return refreshAccessToken();
}

interface SpotifyNowPlayingResponse {
	item: {
		name: string;
		duration_ms: number;
		album: {
			name: string;
			images: { url: string }[];
		};
		artists: { name: string }[];
	};
	is_playing: boolean;
	progress_ms: number;
}

export async function getNowPlaying() {
	const token = await getSpotifyAccessToken();

	const { data, status } = await axiosSpotifyAPI.get<SpotifyNowPlayingResponse>(
		"/me/player/currently-playing",
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
			validateStatus: (status) => status === 200 || status === 204,
		},
	);

	if (status === 204) return null;

	return {
		name: data.item.name,
		artist: data.item.artists.map((a) => a.name).join(", "),
		album: data.item.album.name,
		albumArt: data.item.album.images[0]?.url ?? "",
		isPlaying: data.is_playing,
		progress: data.progress_ms,
		duration: data.item.duration_ms,
	};
}
