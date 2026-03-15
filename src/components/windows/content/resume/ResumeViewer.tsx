"use client";

import { Loader2 } from "lucide-react";
import type { RefObject } from "react";
import type { PDFDocumentProxy } from "@/hooks/resume/usePdfLoader";
import { ResumePageCanvas } from "./ResumePageCanvas";

interface ResumeViewerProps {
	pdf: PDFDocumentProxy | null;
	numPages: number;
	isLoading: boolean;
	error: string | null;
	zoom: number;
	containerRef: RefObject<HTMLDivElement | null>;
	canvasRefs: RefObject<(HTMLCanvasElement | null)[]>;
	loadingText: string;
	errorText: string;
}

export function ResumeViewer({
	pdf,
	numPages,
	isLoading,
	error,
	zoom,
	containerRef,
	canvasRefs,
	loadingText,
	errorText,
}: ResumeViewerProps) {
	// Cast to any so Array.from can render pages — PDFDocumentProxy is `unknown`
	// at compile time to avoid importing pdfjs-dist at module level (SSR crash).
	// biome-ignore lint/suspicious/noExplicitAny: intentional SSR workaround
	const doc = pdf as any;

	return (
		<div ref={containerRef} className="flex-1 overflow-auto bg-[#525659]">
			<div className="py-6 px-4 flex flex-col items-center gap-5">
				{isLoading && (
					<div className="flex flex-col items-center justify-center gap-3 mt-24">
						<Loader2 size={28} className="animate-spin text-zinc-400" />
						<p className="text-sm text-zinc-300">{loadingText}</p>
					</div>
				)}

				{error && !isLoading && (
					<div className="mt-24 px-6 py-4 rounded text-sm text-center max-w-sm bg-red-950 text-red-400">
						{errorText}
					</div>
				)}

				{doc !== null &&
					Array.from({ length: numPages }, (_, i) => (
						<ResumePageCanvas
							key={`page-${i + 1}`}
							pdf={doc}
							pageNumber={i + 1}
							zoom={zoom}
							canvasRef={(el) => {
								canvasRefs.current[i] = el;
							}}
						/>
					))}
			</div>
		</div>
	);
}
