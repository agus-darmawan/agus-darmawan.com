"use client";

import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useRef } from "react";
import type { PDFDocumentProxy } from "@/hooks/resume/usePdfLoader";

const DEVICE_PIXEL_RATIO =
	typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

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
	const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

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
				const page = await pdf.getPage(pageNumber);
				if (cancelled) return;

				const scale = zoom * DEVICE_PIXEL_RATIO;
				const viewport = page.getViewport({ scale });

				canvas.width = viewport.width;
				canvas.height = viewport.height;
				canvas.style.width = `${viewport.width / DEVICE_PIXEL_RATIO}px`;
				canvas.style.height = `${viewport.height / DEVICE_PIXEL_RATIO}px`;

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
