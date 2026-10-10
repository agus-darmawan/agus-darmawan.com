"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { resumeUrl } from "@/config/site";
import { usePdfLoader } from "./hooks/usePdfLoader";
import { usePdfPageTracker } from "./hooks/usePdfPageTracker";
import { usePdfZoom } from "./hooks/usePdfZoom";
import { ResumeToolbar } from "./ResumeToolbar";
import { ResumeViewer } from "./ResumeViewer";

export default function ResumeViewerClient() {
	const t = useTranslations("ResumeWindow");
	const locale = useLocale();
	const url = resumeUrl(locale);
	const filename = `Agus-Darmawan-Resume-${locale.toUpperCase()}.pdf`;

	const { zoom, zoomIn, zoomOut, resetZoom } = usePdfZoom();
	const { pdf, isLoading, failed } = usePdfLoader(url);
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
	const { currentPage, goToPage } = usePdfPageTracker(containerRef, canvasRefs);
	const [downloading, setDownloading] = useState(false);

	// `<a download>` is ignored for cross-origin URLs (the PDF is served from
	// the content host), so the old button navigated away from the desktop.
	// Fetch it and save a same-origin blob instead.
	const download = useCallback(async () => {
		if (!url) return;
		setDownloading(true);
		try {
			const res = await fetch(url);
			if (!res.ok) throw new Error(String(res.status));
			const href = URL.createObjectURL(await res.blob());
			const a = Object.assign(document.createElement("a"), {
				href,
				download: filename,
			});
			a.click();
			setTimeout(() => URL.revokeObjectURL(href), 1_000);
		} catch {
			window.open(url, "_blank", "noopener");
		} finally {
			setDownloading(false);
		}
	}, [url, filename]);

	return (
		<div className="h-full flex flex-col bg-(--window-bg) text-(--text-primary)">
			<ResumeToolbar
				zoom={zoom}
				numPages={pdf?.numPages ?? 0}
				currentPage={currentPage}
				downloading={downloading}
				canDownload={url !== null}
				onZoomIn={zoomIn}
				onZoomOut={zoomOut}
				onResetZoom={resetZoom}
				onPrevPage={() => goToPage(currentPage - 1)}
				onNextPage={() => goToPage(currentPage + 1)}
				onDownload={download}
			/>
			<ResumeViewer
				pdf={pdf}
				isLoading={isLoading}
				failed={failed}
				zoom={zoom}
				containerRef={containerRef}
				canvasRefs={canvasRefs}
				loadingText={t("loading")}
				errorText={t("errorLoad")}
			/>
		</div>
	);
}
