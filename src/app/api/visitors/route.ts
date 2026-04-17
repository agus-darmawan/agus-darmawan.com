// src/app/api/visitors/route.ts
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";

// Cache in memory — refresh every hour
let cache: { count: number; timestamp: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000;

async function fetchVisitorCount(): Promise<number> {
	const accountId = process.env.CF_ACCOUNT_ID;
	const siteTag = process.env.CF_SITE_TAG;
	const apiToken = process.env.CF_API_TOKEN;

	if (!accountId || !siteTag || !apiToken) {
		return 0;
	}

	const query = `
		query {
			viewer {
				accounts(filter: { accountTag: "${accountId}" }) {
					total: rumPageloadEventsAdaptiveGroups(
						filter: { siteTag: "${siteTag}" }
						limit: 1
						orderBy: [date_DESC]
					) {
						count
					}
				}
			}
		}
	`;

	const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query }),
	});
	console.log("Cloudflare API response status:", res);

	if (!res.ok) return 0;

	const data = (await res.json()) as {
		data?: {
			viewer?: {
				accounts?: Array<{
					total?: Array<{ count: number }>;
				}>;
			};
		};
	};
	console.log("Cloudflare API response data:", data);

	return data?.data?.viewer?.accounts?.[0]?.total?.[0]?.count ?? 0;
}

export async function GET() {
	try {
		// Return cached if fresh
		if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
			return NextResponse.json<ApiResponse<{ count: number }>>({
				success: true,
				data: { count: cache.count },
			});
		}

		const count = await fetchVisitorCount();
		cache = { count, timestamp: Date.now() };

		return NextResponse.json<ApiResponse<{ count: number }>>({
			success: true,
			data: { count },
		});
	} catch {
		return NextResponse.json<ApiResponse<{ count: number }>>({
			success: true,
			data: { count: 0 },
		});
	}
}
