import { RefObject, useEffect } from "react";

interface UseClickOutsideOptions<T extends HTMLElement = HTMLElement> {
	ref: RefObject<T> | null;
	onOutside: () => void;
}

export function useClickOutside<T extends HTMLElement = HTMLElement>({
	ref,
	onOutside,
}: UseClickOutsideOptions<T>) {
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (!ref?.current) return;
			if (!ref?.current.contains(e.target as Node)) {
				onOutside();
			}
		};

		document.addEventListener("mousedown", handler);
		return () => {
			document.removeEventListener("mousedown", handler);
		};
	}, [ref, onOutside]);
}
