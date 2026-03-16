import { type RefObject, useCallback, useEffect, useState } from "react";
import type { TocEntry } from "../types/project.types";

export function useReadmeScroll(
	containerRef: RefObject<HTMLDivElement | null>,
	toc: TocEntry[],
) {
	const [activeId, setActiveId] = useState<string | null>(toc[0]?.id ?? null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || toc.length === 0) return;

		const handler = () => {
			const containerTop = container.getBoundingClientRect().top;
			for (const entry of toc) {
				const el = container.querySelector(`#${entry.id}`);
				if (!el) continue;
				const { top } = el.getBoundingClientRect();
				if (top - containerTop > -8) {
					setActiveId(entry.id);
					return;
				}
			}
			// If we've scrolled past all headings, highlight the last one
			setActiveId(toc[toc.length - 1]?.id ?? null);
		};

		container.addEventListener("scroll", handler, { passive: true });
		return () => container.removeEventListener("scroll", handler);
	}, [containerRef, toc]);

	const navigateTo = useCallback(
		(id: string) => {
			const container = containerRef.current;
			if (!container) return;
			const el = container.querySelector(`#${id}`);
			if (!el) return;
			const containerTop = container.getBoundingClientRect().top;
			const elTop = el.getBoundingClientRect().top;
			container.scrollBy({
				top: elTop - containerTop - 16,
				behavior: "smooth",
			});
			setActiveId(id);
		},
		[containerRef],
	);

	return { activeId, navigateTo };
}
