import { type RefObject, useCallback, useEffect, useState } from "react";
import type { TocEntry } from "@/lib/markdown/types";

// `#${id}` is an invalid selector for ids like "2-install": always escape.
const byId = (root: ParentNode, id: string) =>
	root.querySelector<HTMLElement>(`[id="${CSS.escape(id)}"]`);

/** Where a heading counts as "reached": just below the page's sticky header. */
const PAGE_OFFSET = 96;
const WINDOW_OFFSET = 24;

const smooth = (): ScrollBehavior =>
	matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

/**
 * The section being read (for the table of contents) and a way to jump to
 * one. Pass the scroll container (desktop windows) or `null` to follow the
 * page (website).
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
			const line =
				(container?.getBoundingClientRect().top ?? 0) +
				(container ? WINDOW_OFFSET : PAGE_OFFSET);
			// The last heading above the line is the section being read.
			let current = toc[0].id;
			for (const entry of toc) {
				const el = byId(root, entry.id);
				if (!el) continue;
				if (el.getBoundingClientRect().top - line > 1) break;
				current = entry.id;
			}
			// A short last section never reaches the line: at the very end
			// of the scroll, it is the one being read.
			const end = container
				? container.scrollTop + container.clientHeight >=
					container.scrollHeight - 2
				: false;
			setActiveId(end ? (toc.at(-1)?.id ?? current) : current);
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		update();
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
			if (container) {
				// Scroll only the window body: scrollIntoView would also move
				// the desktop around it.
				container.scrollBy({
					top:
						el.getBoundingClientRect().top -
						container.getBoundingClientRect().top -
						WINDOW_OFFSET +
						1,
					behavior: smooth(),
				});
			} else {
				// Headings carry a scroll-margin for the sticky header.
				el.scrollIntoView({ behavior: smooth(), block: "start" });
				history.replaceState(null, "", `#${id}`);
			}
			setActiveId(id);
		},
		[containerRef],
	);

	return { activeId, navigateTo };
}
