import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ApiResponse } from "@/types/api";

const REFETCH_INTERVAL = 10_000;

async function fetchPing(): Promise<number> {
	const start = performance.now();
	await axios.get<ApiResponse<{ ok: boolean }>>("/api/ping");
	return Math.round(performance.now() - start);
}

interface UsePingResult {
	ping: number | null;
	/** 0 = just fetched → 1 = about to fetch again */
	refreshProgress: number;
	isLoading: boolean;
}

export function usePing(): UsePingResult {
	const { data, isLoading, dataUpdatedAt } = useQuery({
		queryKey: ["ping"],
		queryFn: fetchPing,
		refetchInterval: REFETCH_INTERVAL,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: true,
		retry: false,
	});

	const elapsed = dataUpdatedAt ? Date.now() - dataUpdatedAt : 0;
	const refreshProgress = Math.min(elapsed / REFETCH_INTERVAL, 1);

	return {
		ping: data ?? null,
		refreshProgress,
		isLoading,
	};
}
