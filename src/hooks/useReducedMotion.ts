import { useEffect, useState } from "react";

/**
 * Returns true if the user has requested reduced motion.
 * Use this to conditionally disable animations.
 *
 * @example
 * const reduced = useReducedMotion();
 * <motion.div animate={reduced ? {} : { scale: 1.1 }} />
 */
export function useReducedMotion(): boolean {
	const [reduced, setReduced] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(mq.matches);

		const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	return reduced;
}
