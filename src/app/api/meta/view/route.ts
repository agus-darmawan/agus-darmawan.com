import type { NextRequest } from "next/server";
import { fail, guardWrite, isBot, respond, visitorOf } from "@/lib/meta/http";

/** Counts a view of `{ item }`, once per visitor per day; returns the counts. */
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
	const guard = await guardWrite(req);
	if ("response" in guard) return guard.response;
	const { store, item } = guard;
	const visitor = visitorOf(req, true);

	try {
		const counts = isBot(req)
			? (await store.counts([item], visitor.hash))[0]
			: await store.view(item, visitor.hash);
		return respond(counts, visitor);
	} catch (error) {
		console.error("[meta] view failed:", error);
		return fail(503, "unavailable", "Counts are unavailable");
	}
}
