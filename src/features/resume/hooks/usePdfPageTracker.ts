import { type RefObject, useCallback, useEffect, useState } from "react";

interface UsePdfPageTrackerResult {
	currentPage: number;
	goToPage: (page: number) => void;
	setCurrentPage: (page: number) => void;
}

export function usePdfPageTracker(
	containerRef: RefObject<HTMLDivElement | null>,
	canvasRefs: RefObject<(HTMLCanvasElement | null)[]>,
): UsePdfPageTrackerResult {
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleScroll = () => {
			const containerTop = container.getBoundingClientRect().top;
			const refs = canvasRefs.current;
			for (let i = 0; i < refs.length; i++) {
				const canvas = refs[i];
				if (!canvas) continue;
				const { top, height } = canvas.getBoundingClientRect();
				if (top - containerTop > -(height / 2)) {
					setCurrentPage(i + 1);
					break;
				}
			}
		};

		container.addEventListener("scroll", handleScroll, { passive: true });
		return () => container.removeEventListener("scroll", handleScroll);
	}, [containerRef, canvasRefs]);

	const goToPage = useCallback(
		(page: number) => {
			const refs = canvasRefs.current;
			const target = Math.max(1, Math.min(page, refs.length));
			refs[target - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
			setCurrentPage(target);
		},
		[canvasRefs],
	);

	return { currentPage, goToPage, setCurrentPage };
}
