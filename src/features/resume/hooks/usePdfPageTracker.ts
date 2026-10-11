import { type RefObject, useCallback, useEffect, useState } from "react";

/** Tracks the page in view and scrolls the viewer (not the page) to one. */
export function usePdfPageTracker(
	containerRef: RefObject<HTMLDivElement | null>,
	canvasRefs: RefObject<(HTMLCanvasElement | null)[]>,
) {
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const onScroll = () => {
			const containerTop = container.getBoundingClientRect().top;
			const index = canvasRefs.current.findIndex((canvas) => {
				if (!canvas) return false;
				const { top, height } = canvas.getBoundingClientRect();
				return top - containerTop > -(height / 2);
			});
			if (index !== -1) setCurrentPage(index + 1);
		};

		container.addEventListener("scroll", onScroll, { passive: true });
		return () => container.removeEventListener("scroll", onScroll);
	}, [containerRef, canvasRefs]);

	const goToPage = useCallback(
		(page: number) => {
			const container = containerRef.current;
			const pages = canvasRefs.current;
			const target = Math.max(1, Math.min(page, pages.length));
			const canvas = pages[target - 1];
			if (!container || !canvas) return;
			container.scrollTo({
				top: canvas.offsetTop - 24,
				behavior: "smooth",
			});
			setCurrentPage(target);
		},
		[containerRef, canvasRefs],
	);

	return { currentPage, goToPage };
}
