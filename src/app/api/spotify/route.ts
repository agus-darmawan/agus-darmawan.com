import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";
import type { ApiResponse } from "@/types/api";
import type { SpotifyTrack } from "@/types/spotify";

// Every visitor polls this every 10 s — let the CDN absorb it instead of
// hitting Spotify (and its rate limit) once per open tab.
const CACHE_HEADERS = {
	"Cache-Control": "public, s-maxage=10, stale-while-revalidate=20",
};

export async function GET() {
	try {
		const track = await getNowPlaying();
		return NextResponse.json<ApiResponse<SpotifyTrack | null>>(
			{ success: true, data: track },
			{ headers: CACHE_HEADERS },
		);
	} catch (error) {
		console.error("Spotify API error:", error);
		return NextResponse.json<ApiResponse<null>>(
			{ success: false, data: null, error: "Failed to fetch Spotify data" },
			{ status: 502 },
		);
	}
}
