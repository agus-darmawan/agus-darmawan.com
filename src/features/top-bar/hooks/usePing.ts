import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/fetch-json";
import type { ApiResponse } from "@/types/api";

export const PING_INTERVAL = 10_000;

async function measurePing(): Promise<number> {
	const start = performance.now();
	await fetchJson<ApiResponse<{ ok: true }>>("/api/ping", {
		cache: "no-store",
		timeoutMs: 5_000,
	});
	return Math.round(performance.now() - start);
}

export function usePing() {
	const { data, isError, dataUpdatedAt } = useQuery({
		queryKey: ["ping"],
		queryFn: measurePing,
		refetchInterval: PING_INTERVAL,
		refetchOnWindowFocus: true,
		retry: false,
	});

	return {
		// TanStack keeps the last good value on error; a failed ping is offline.
		ping: isError ? null : (data ?? null),
		updatedAt: dataUpdatedAt,
	};
}
