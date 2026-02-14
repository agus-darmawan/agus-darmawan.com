import { NextResponse } from "next/server";

type ApiResponse<T> = {
	success: boolean;
	data: T | null;
	error?: string;
};

export async function GET() {
	const response: ApiResponse<{ ok: boolean }> = {
		success: true,
		data: { ok: true },
	};

	return NextResponse.json(response);
}
