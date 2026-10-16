import type { NextRequest } from "next/server";
import {
	type CountsById,
	fail,
	isItemKey,
	knownItems,
	respond,
	visitorOf,
} from "@/lib/meta/http";
import { getMetaStore } from "@/lib/meta/store";

/**
 * Views and likes of up to 60 items: `/api/meta?items=project:a,blog:b`.
 * `data: null` means the feature is switched off (no Redis configured).
 */
export const dynamic = "force-dynamic";

const MAX_ITEMS = 60;

export async function GET(req: NextRequest) {
	const store = getMetaStore();
	if (!store) return respond(null);

	const requested = (req.nextUrl.searchParams.get("items") ?? "")
		.split(",")
		.filter(isItemKey)
		.slice(0, MAX_ITEMS);
	const known = await knownItems();
	const items = [...new Set(requested)].filter((item) => known.has(item));

	try {
		const counts = await store.counts(
			items,
			visitorOf(req, false)?.hash ?? null,
		);
		const data: CountsById = Object.fromEntries(
			items.map((item, i) => [item, counts[i]]),
		);
		return respond(data);
	} catch (error) {
		console.error("[meta] read failed:", error);
		return fail(503, "unavailable", "Counts are unavailable");
	}
}
