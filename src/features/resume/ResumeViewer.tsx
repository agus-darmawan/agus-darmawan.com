"use client";

import { Loader2 } from "lucide-react";
import type { RefObject } from "react";
import type { PDFDocumentProxy } from "./hooks/usePdfLoader";
import { ResumePageCanvas } from "./ResumePageCanvas";

interface ResumeViewerProps {
	pdf: PDFDocumentProxy | null;
	isLoading: boolean;
	failed: boolean;
	zoom: number;
	containerRef: RefObject<HTMLDivElement | null>;
	canvasRefs: RefObject<(HTMLCanvasElement | null)[]>;
	loadingText: string;
	errorText: string;
}

export function ResumeViewer({
	pdf,
	isLoading,
	failed,
	zoom,
	containerRef,
	canvasRefs,
	loadingText,
	errorText,
}: ResumeViewerProps) {
	return (
		<div
			ref={containerRef}
			className="relative flex-1 overflow-auto bg-slate-500 dark:bg-[#525659]"
		>
			<div className="py-6 px-4 flex flex-col items-center gap-5">
				{isLoading && <PdfLoading text={loadingText} />}

				{failed && (
					<p
						role="alert"
						className="mt-24 px-6 py-4 rounded text-sm text-center max-w-sm bg-red-950 text-red-400"
					>
						{errorText}
					</p>
				)}

				{pdf &&
					Array.from({ length: pdf.numPages }, (_, i) => (
						<ResumePageCanvas
							key={i + 1}
							pdf={pdf}
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

export function PdfLoading({ text }: { text: string }) {
	return (
		<div
			role="status"
			className="flex flex-col items-center justify-center gap-3 mt-24"
		>
			<Loader2 size={28} className="animate-spin text-zinc-300" aria-hidden />
			<p className="text-sm text-zinc-200">{text}</p>
		</div>
	);
}
