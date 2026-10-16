import "server-only";
import { createHmac, randomUUID } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { getPosts, getProjects } from "@/lib/content";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import type { ApiResponse } from "@/types/api";
import { ITEM_KEY, itemKey } from "./keys";
import {
	getMetaStore,
	type MetaCounts,
	type MetaStore,
	metaSalt,
} from "./store";

/**
 * Shared plumbing of the views/likes routes: which items exist, who the
 * visitor is, and the guards every write goes through.
 */

const COOKIE = "vid";
const YEAR_SECONDS = 60 * 60 * 24 * 365;

export type CountsById = Record<string, MetaCounts>;

const KNOWN_TTL_MS = 10 * 60_000;
let known: { items: Set<string>; expires: number } | null = null;

/**
 * `kind:slug` of every project and post (slugs are the same in all
 * locales). Kept for a few minutes: every count request asks.
 */
export async function knownItems(): Promise<Set<string>> {
	if (known && known.expires > Date.now()) return known.items;
	const [projects, posts] = await Promise.all([
		getProjects(routing.defaultLocale),
		getPosts(routing.defaultLocale),
	]);
	const items = new Set([...projects, ...posts].map(itemKey));
	known = { items, expires: Date.now() + KNOWN_TTL_MS };
	return items;
}

export const isItemKey = (value: string) => ITEM_KEY.test(value);

interface Visitor {
	/** What the store keeps: a keyed hash, never the cookie itself. */
	hash: string;
	/** A new id to set as the cookie, when the request had none. */
	fresh: string | null;
}

export function visitorOf(req: NextRequest, create: true): Visitor;
export function visitorOf(req: NextRequest, create: false): Visitor | null;
export function visitorOf(req: NextRequest, create: boolean): Visitor | null {
	const cookie = req.cookies.get(COOKIE)?.value;
	const known = cookie && /^[\w-]{16,64}$/.test(cookie) ? cookie : null;
	if (!known && !create) return null;
	const id = known ?? randomUUID();
	return {
		hash: createHmac("sha256", metaSalt())
			.update(id)
			.digest("base64url")
			.slice(0, 24),
		fresh: known ? null : id,
	};
}

export function respond(
	data: CountsById | MetaCounts | null,
	visitor?: Visitor | null,
) {
	const res = NextResponse.json<ApiResponse<typeof data>>({
		success: true,
		data,
	});
	if (visitor?.fresh) {
		res.cookies.set(COOKIE, visitor.fresh, {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			maxAge: YEAR_SECONDS,
			path: "/",
		});
	}
	res.headers.set("Cache-Control", "private, no-store");
	return res;
}

export function fail(status: number, code: string, error: string) {
	return NextResponse.json<ApiResponse<null>>(
		{ success: false, data: null, code, error },
		{ status, headers: { "Cache-Control": "no-store" } },
	);
}

const BOT =
	/bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i;
export const isBot = (req: NextRequest) =>
	BOT.test(req.headers.get("user-agent") ?? "");

const rateLimit = createRateLimiter({ limit: 30, windowMs: 60_000 });

/**
 * Checks shared by the write routes: switched on, sent by this site's own
 * pages as JSON, not too often, and about an item that exists. Returns the
 * store and the item, or the response to send instead.
 */
export async function guardWrite(
	req: NextRequest,
): Promise<
	| { store: MetaStore; body: Record<string, unknown>; item: string }
	| { response: NextResponse }
> {
	const store = getMetaStore();
	if (!store) return { response: respond(null) };

	// Cross-site forms can post text/plain, never JSON without CORS.
	if (!req.headers.get("content-type")?.startsWith("application/json")) {
		return { response: fail(415, "unsupported", "Send JSON") };
	}
	const site = req.headers.get("sec-fetch-site");
	if (site && site !== "same-origin") {
		return { response: fail(403, "forbidden", "Same-origin requests only") };
	}
	const limit = rateLimit(clientIp(req.headers));
	if (!limit.ok) {
		return { response: fail(429, "rate_limited", "Too many requests") };
	}

	const body = (await req.json().catch(() => null)) as Record<
		string,
		unknown
	> | null;
	const item = typeof body?.item === "string" ? body.item : "";
	if (!body || !isItemKey(item) || !(await knownItems()).has(item)) {
		return { response: fail(404, "not_found", "No such item") };
	}
	return { store, body, item };
}
