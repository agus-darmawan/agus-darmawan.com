import { type RefObject, useEffect, useRef } from "react";

/**
 * Calls `onOutside` on a pointer press outside `ref`. The callback is read
 * through a ref, so callers don't need to memoize it and the document
 * listener is bound once instead of on every render.
 */
export function useClickOutside(
	ref: RefObject<HTMLElement | null>,
	onOutside: () => void,
) {
	const callback = useRef(onOutside);
	useEffect(() => {
		callback.current = onOutside;
	});

	useEffect(() => {
		const handler = (e: PointerEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				callback.current();
			}
		};
		document.addEventListener("pointerdown", handler);
		return () => document.removeEventListener("pointerdown", handler);
	}, [ref]);
}
