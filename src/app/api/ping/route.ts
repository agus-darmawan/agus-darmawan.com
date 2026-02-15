import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api";

export async function GET() {
	const response: ApiResponse<{ ok: boolean }> = {
		success: true,
		data: { ok: true },
	};

	return NextResponse.json(response);
}
