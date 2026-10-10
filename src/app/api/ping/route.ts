import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";

/** Round-trip target for the top bar latency indicator. Never cached. */
export function GET() {
	return NextResponse.json<ApiResponse<{ ok: true }>>(
		{ success: true, data: { ok: true } },
		{ headers: { "Cache-Control": "no-store" } },
	);
}
