import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ApiResponse } from "@/types/api";
import { useRefreshProgress } from "../useRefreshProgress";

const REFETCH_INTERVAL = 10_000;

async function fetchPing(): Promise<number> {
	const start = performance.now();
	await axios.get<ApiResponse<{ ok: boolean }>>("/api/ping");
	return Math.round(performance.now() - start);
}

export interface UsePingResult {
	ping: number | null;
	/** Smooth 0→1 arc progress toward next refetch */
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

	const refreshProgress = useRefreshProgress(dataUpdatedAt, REFETCH_INTERVAL);

	return {
		ping: data ?? null,
		refreshProgress,
		isLoading,
	};
}
