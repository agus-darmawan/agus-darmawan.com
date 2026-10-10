import { useCallback, useSyncExternalStore } from "react";

/** Subscribes to a CSS media query; `false` during SSR and hydration. */
export function useMediaQuery(query: string): boolean {
	const subscribe = useCallback(
		(onChange: () => void) => {
			const mq = window.matchMedia(query);
			mq.addEventListener("change", onChange);
			return () => mq.removeEventListener("change", onChange);
		},
		[query],
	);

	return useSyncExternalStore(
		subscribe,
		() => window.matchMedia(query).matches,
		() => false,
	);
}

/** Matches the `md` breakpoint the store and drag hook use (768px). */
export const MOBILE_QUERY = "(max-width: 767.98px)";

export const useIsMobile = () => useMediaQuery(MOBILE_QUERY);

export const useReducedMotion = () =>
	useMediaQuery("(prefers-reduced-motion: reduce)");
