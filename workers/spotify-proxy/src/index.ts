import type { ExecutionContext } from "@cloudflare/workers-types";

interface Env {
	SPOTIFY_CLIENT_ID: string;
	SPOTIFY_CLIENT_SECRET: string;
	SPOTIFY_REFRESH_TOKEN: string;
	ALLOWED_ORIGIN: string;
}

interface SpotifyTokenResponse {
	access_token: string;
}

interface SpotifyNowPlaying {
	currently_playing_type: "track" | "episode" | "ad" | "unknown";
	// null for ads / private sessions; podcasts have no album/artists
	item: {
		name: string;
		duration_ms: number;
		album?: {
			name: string;
			images: { url: string }[];
		};
		artists?: { name: string }[];
	} | null;
	is_playing: boolean;
	progress_ms: number | null;
}

async function getAccessToken(env: Env): Promise<string | null> {
	try {
		const res = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization:
					"Basic " +
					btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`),
			},
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: env.SPOTIFY_REFRESH_TOKEN,
			}),
		});

		const data = (await res.json()) as SpotifyTokenResponse;
		return data.access_token ?? null;
	} catch {
		return null;
	}
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const corsHeaders = {
			"Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
			"Access-Control-Allow-Methods": "GET",
		};

		// Handle CORS preflight
		if (request.method === "OPTIONS") {
			return new Response(null, { headers: corsHeaders });
		}

		// Check cache first
		const cache = await caches.open("spotify");
		const cacheKey = new Request(request.url);
		const cached = await cache.match(cacheKey);
		if (cached) return cached;

		const token = await getAccessToken(env);

		if (!token) {
			return Response.json(
				{ success: false, data: null, error: "Failed to get token" },
				{ headers: corsHeaders },
			);
		}

		const spotifyRes = await fetch(
			"https://api.spotify.com/v1/me/player/currently-playing",
			{ headers: { Authorization: `Bearer ${token}` } },
		);

		// 204 = nothing playing
		const data =
			spotifyRes.status === 200
				? ((await spotifyRes.json()) as SpotifyNowPlaying)
				: null;

		// Same shape as src/lib/spotify.ts — ads/podcasts are treated as "nothing playing"
		const item = data?.currently_playing_type === "track" ? data.item : null;
		const normalized =
			data === null || item === null
				? null
				: {
						name: item.name,
						artist: item.artists?.map((a) => a.name).join(", ") ?? "",
						album: item.album?.name ?? "",
						albumArt: item.album?.images[0]?.url ?? "",
						isPlaying: data.is_playing,
						progress: data.progress_ms ?? 0,
						duration: item.duration_ms,
					};

		const response = Response.json(
			{ success: true, data: normalized },
			{
				headers: {
					...corsHeaders,
					"Cache-Control": "public, max-age=10",
				},
			},
		);

		ctx.waitUntil(cache.put(cacheKey, response.clone()));

		return response;
	},
};
