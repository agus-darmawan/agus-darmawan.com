"use client";

import { useEffect, useRef } from "react";
import type { PDFDocumentProxy } from "@/hooks/resume/usePdfLoader";

// Access devicePixelRatio lazily inside the effect — never at module scope
// (would crash in SSR even though this file is "use client").
function getDpr() {
	return typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
}

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
	const renderTaskRef = useRef<{ cancel: () => void } | null>(null);

	useEffect(() => {
		const canvas = localRef.current;
		if (!canvas) return;

		let cancelled = false;

		const render = async () => {
			if (renderTaskRef.current) {
				renderTaskRef.current.cancel();
				renderTaskRef.current = null;
			}

			try {
				// Cast to `any` here — PDFDocumentProxy is `unknown` at compile
				// time to avoid importing pdfjs-dist at the module level (SSR crash).
				// The value is always the real PDFDocumentProxy at runtime because
				// this component is only ever rendered after the dynamic import resolves.
				// biome-ignore lint/suspicious/noExplicitAny: intentional SSR workaround
				const doc = pdf as any;
				const page = await doc.getPage(pageNumber);
				if (cancelled) return;

				const dpr = getDpr();
				const scale = zoom * dpr;
				const viewport = page.getViewport({ scale });

				canvas.width = viewport.width;
				canvas.height = viewport.height;
				canvas.style.width = `${viewport.width / dpr}px`;
				canvas.style.height = `${viewport.height / dpr}px`;

				const ctx = canvas.getContext("2d");
				if (!ctx || cancelled) return;

				const task = page.render({ canvas, canvasContext: ctx, viewport });
				renderTaskRef.current = task;
				await task.promise;
			} catch (err: unknown) {
				if (
					err instanceof Error &&
					err.name !== "RenderingCancelledException"
				) {
					console.error(`Error rendering page ${pageNumber}:`, err);
				}
			}
		};

		render();

		return () => {
			cancelled = true;
			renderTaskRef.current?.cancel();
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
