import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";

const CACHE_TTL_MS = 60 * 60 * 1000;
const WINDOW_DAYS = 30;

let cache: { count: number; expires: number } | null = null;

/** Page loads over the last 30 days from Cloudflare Web Analytics. */
async function fetchVisitorCount(): Promise<number | null> {
	const { CF_ACCOUNT_ID, CF_SITE_TAG, CF_API_TOKEN } = process.env;
	if (!CF_ACCOUNT_ID || !CF_SITE_TAG || !CF_API_TOKEN) return null;

	const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000)
		.toISOString()
		.slice(0, 10);

	const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${CF_API_TOKEN}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `query ($account: String!, $site: String!, $since: Date!) {
				viewer {
					accounts(filter: { accountTag: $account }) {
						total: rumPageloadEventsAdaptiveGroups(
							filter: { siteTag: $site, date_geq: $since }
							limit: 1
						) { count }
					}
				}
			}`,
			variables: { account: CF_ACCOUNT_ID, site: CF_SITE_TAG, since },
		}),
		signal: AbortSignal.timeout(5_000),
	});
	if (!res.ok) return null;

	const json = (await res.json()) as {
		data?: { viewer?: { accounts?: { total?: { count: number }[] }[] } };
	};
	return json.data?.viewer?.accounts?.[0]?.total?.[0]?.count ?? null;
}

export async function GET() {
	if (!cache || Date.now() > cache.expires) {
		const count = await fetchVisitorCount().catch(() => null);
		// Only cache real answers — a failed lookup used to pin "0" for an hour.
		if (count !== null) cache = { count, expires: Date.now() + CACHE_TTL_MS };
	}

	return cache
		? NextResponse.json<ApiResponse<{ count: number }>>({
				success: true,
				data: { count: cache.count },
			})
		: NextResponse.json<ApiResponse<null>>(
				{ success: false, data: null, error: "Visitor count unavailable" },
				{ status: 503 },
			);
}
