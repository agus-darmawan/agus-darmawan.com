import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";

export async function GET() {
	try {
		const track = await getNowPlaying();
		return NextResponse.json({ track });
	} catch (error) {
		console.error("Spotify API error:", error);
		return NextResponse.json({ track: null });
	}
}
