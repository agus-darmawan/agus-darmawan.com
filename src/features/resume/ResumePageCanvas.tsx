"use client";

import type { RenderTask } from "pdfjs-dist";
import { useEffect, useRef } from "react";
import type { PDFDocumentProxy } from "./hooks/usePdfLoader";

interface ResumePageCanvasProps {
	pdf: PDFDocumentProxy;
	pageNumber: number;
	zoom: number;
	canvasRef: (el: HTMLCanvasElement | null) => void;
}

export function ResumePageCanvas({
	pdf,
	pageNumber,
	zoom,
	canvasRef,
}: ResumePageCanvasProps) {
	const localRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = localRef.current;
		if (!canvas) return;
		let cancelled = false;
		let task: RenderTask | null = null;

		(async () => {
			try {
				const page = await pdf.getPage(pageNumber);
				if (cancelled) return;

				const dpr = window.devicePixelRatio || 1;
				const viewport = page.getViewport({ scale: zoom * dpr });
				canvas.width = viewport.width;
				canvas.height = viewport.height;
				canvas.style.width = `${viewport.width / dpr}px`;
				canvas.style.height = `${viewport.height / dpr}px`;

				const ctx = canvas.getContext("2d");
				if (!ctx) return;
				task = page.render({ canvas, canvasContext: ctx, viewport });
				await task.promise;
			} catch (error) {
				if (
					!(
						error instanceof Error &&
						error.name === "RenderingCancelledException"
					)
				) {
					console.error(`Error rendering page ${pageNumber}:`, error);
				}
			}
		})();

		return () => {
			cancelled = true;
			task?.cancel();
		};
	}, [pdf, pageNumber, zoom]);

	return (
		<canvas
			ref={(el) => {
				localRef.current = el;
				canvasRef(el);
			}}
			className="block rounded-sm shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
		/>
	);
}
