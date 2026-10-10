import { type RefObject, useCallback, useEffect, useState } from "react";
import type { TocEntry } from "@/lib/markdown/types";

// `#${id}` is an invalid selector for ids like "2-install" — always escape.
const byId = (root: ParentNode, id: string) =>
	root.querySelector<HTMLElement>(`[id="${CSS.escape(id)}"]`);

/**
 * Tracks which heading is in view (TOC highlight).
 * Pass a scroll container ref (desktop windows) or `null` to follow the
 * page scroll (standalone /projects and /blog routes).
 */
export function useHeadingScroll(
	containerRef: RefObject<HTMLElement | null> | null,
	toc: TocEntry[],
) {
	const [activeId, setActiveId] = useState<string | null>(toc[0]?.id ?? null);

	useEffect(() => {
		if (toc.length === 0) return;
		const container = containerRef?.current ?? null;
		if (containerRef && !container) return;
		const target: HTMLElement | Window = container ?? window;
		const root: ParentNode = container ?? document;

		let frame = 0;
		const update = () => {
			frame = 0;
			const containerTop = container?.getBoundingClientRect().top ?? 80;
			for (const entry of toc) {
				const el = byId(root, entry.id);
				if (el && el.getBoundingClientRect().top - containerTop > -8) {
					setActiveId(entry.id);
					return;
				}
			}
			setActiveId(toc[toc.length - 1]?.id ?? null);
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		target.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			target.removeEventListener("scroll", onScroll);
			cancelAnimationFrame(frame);
		};
	}, [containerRef, toc]);

	const navigateTo = useCallback(
		(id: string) => {
			const container = containerRef?.current ?? null;
			const el = byId(container ?? document, id);
			if (!el) return;
			const offset = container
				? container.getBoundingClientRect().top + 16
				: 80;
			(container ?? window).scrollBy({
				top: el.getBoundingClientRect().top - offset,
				behavior: "smooth",
			});
			if (!container) history.replaceState(null, "", `#${id}`);
			setActiveId(id);
		},
		[containerRef],
	);

	return { activeId, navigateTo };
}
