"use client";

import { useParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { usePdfLoader } from "./hooks/usePdfLoader";
import { usePdfPageTracker } from "./hooks/usePdfPageTracker";
import { usePdfZoom } from "./hooks/usePdfZoom";
import { ResumePageCanvas } from "./ResumePageCanvas";
import { ResumeToolbar } from "./ResumeToolbar";
import { ResumeViewer } from "./ResumeViewer";

interface ResumeViewerClientProps {
	// t is passed in from the server-safe wrapper to avoid calling useTranslations
	// inside a dynamically-imported component (which has no SSR context).
	t: (key: string) => string;
}

export default function ResumeViewerClient({ t }: ResumeViewerClientProps) {
	const params = useParams();
	const locale = (params?.locale as string) ?? "en";
	const contentUrl = process.env.NEXT_PUBLIC_CONTENT_URL ?? "";
	const pdfPath = `${contentUrl}/resume/resume_${locale}.pdf`;
	const { zoom, zoomIn, zoomOut, resetZoom } = usePdfZoom();
	const { pdf, numPages, isLoading, error } = usePdfLoader(pdfPath);

	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

	const { currentPage, goToPage } = usePdfPageTracker(containerRef, canvasRefs);

	const handleDownload = useCallback(() => {
		const a = document.createElement("a");
		a.href = pdfPath;
		a.download = `resume_${locale}.pdf`;
		a.click();
	}, [pdfPath, locale]);

	return (
		<div className="h-full flex flex-col bg-(--window-bg) text-(--text-primary)">
			<ResumeToolbar
				zoom={zoom}
				numPages={numPages}
				currentPage={currentPage}
				onZoomIn={zoomIn}
				onZoomOut={zoomOut}
				onResetZoom={resetZoom}
				onPrevPage={() => goToPage(currentPage - 1)}
				onNextPage={() => goToPage(currentPage + 1)}
				onDownload={handleDownload}
				t={t}
			/>
			<ResumeViewer
				pdf={pdf}
				numPages={numPages}
				isLoading={isLoading}
				error={error}
				zoom={zoom}
				containerRef={containerRef}
				canvasRefs={canvasRefs}
				loadingText={t("loading")}
				errorText={t("errorLoad")}
			/>
		</div>
	);
}
