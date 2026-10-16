import type { NextRequest } from "next/server";
import { fail, guardWrite, respond, visitorOf } from "@/lib/meta/http";

/** Sets whether this visitor likes `{ item }` (`liked: true|false`). */
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
	const guard = await guardWrite(req);
	if ("response" in guard) return guard.response;
	const { store, body, item } = guard;
	if (typeof body.liked !== "boolean") {
		return fail(400, "invalid", "`liked` must be true or false");
	}
	const visitor = visitorOf(req, true);

	try {
		return respond(await store.like(item, visitor.hash, body.liked), visitor);
	} catch (error) {
		console.error("[meta] like failed:", error);
		return fail(503, "unavailable", "Counts are unavailable");
	}
}
