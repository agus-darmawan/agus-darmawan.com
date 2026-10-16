"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/api";

/**
 * Views and likes from /api/meta. Every hook resolves to `null` when the
 * feature is switched off (or the store is down): the UI then shows nothing
 * rather than zeros.
 */

export interface Counts {
	views: number;
	likes: number;
	liked: boolean;
}

type CountsById = Record<string, Counts>;

async function call<T>(url: string, init?: RequestInit): Promise<T | null> {
	const res = await fetch(url, init);
	const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;
	if (!res.ok || !json?.success) return null;
	return json.data;
}

const post = <T>(path: string, body: unknown) =>
	call<T>(path, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

const itemQueryKey = (item: string) => ["meta", "item", item] as const;

/** Counts for a list of items (cards); one request for the whole list. */
export function useCountsList(items: string[]) {
	return useQuery({
		queryKey: ["meta", "list", items],
		queryFn: ({ signal }) =>
			call<CountsById>(
				`/api/meta?items=${encodeURIComponent(items.join(","))}`,
				{ signal },
			),
		enabled: items.length > 0,
		staleTime: 60_000,
		retry: false,
	});
}

/**
 * Counts for the item being read. Fetching them is what counts the view
 * (the server counts each visitor once a day), so it happens once per open.
 */
export function useItemCounts(item: string) {
	return useQuery({
		queryKey: itemQueryKey(item),
		queryFn: () => post<Counts>("/api/meta/view", { item }),
		staleTime: Number.POSITIVE_INFINITY,
		retry: false,
	});
}

/** Likes or unlikes, showing the result before the server confirms it. */
export function useLike(item: string) {
	const client = useQueryClient();
	const key = itemQueryKey(item);

	return useMutation({
		mutationFn: (liked: boolean) =>
			post<Counts>("/api/meta/like", { item, liked }),
		onMutate: async (liked) => {
			await client.cancelQueries({ queryKey: key });
			const previous = client.getQueryData<Counts | null>(key);
			if (previous) {
				client.setQueryData<Counts>(key, {
					...previous,
					liked,
					likes: Math.max(0, previous.likes + (liked ? 1 : -1)),
				});
			}
			return { previous };
		},
		onError: (_error, _liked, context) => {
			client.setQueryData(key, context?.previous ?? null);
		},
		onSuccess: (counts, _liked, context) => {
			client.setQueryData(key, counts ?? context?.previous ?? null);
			void client.invalidateQueries({ queryKey: ["meta", "list"] });
		},
	});
}
