import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";
import { ApiResponse } from "@/types/api";

export async function GET() {
	try {
		const track = await getNowPlaying();

		const response: ApiResponse<typeof track> = {
			success: true,
			data: track,
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error("Spotify API error:", error);

		const response: ApiResponse<null> = {
			success: false,
			data: null,
			error: "Failed to fetch Spotify data",
		};

		return NextResponse.json(response, { status: 500 });
	}
}
