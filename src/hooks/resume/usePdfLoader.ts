import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useRef, useState } from "react";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url,
).toString();

export type PDFDocumentProxy = Awaited<
	ReturnType<typeof pdfjsLib.getDocument>["promise"]
>;

interface UsePdfLoaderResult {
	pdf: PDFDocumentProxy | null;
	numPages: number;
	isLoading: boolean;
	error: string | null;
}

export function usePdfLoader(pdfPath: string): UsePdfLoaderResult {
	const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
	const [numPages, setNumPages] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);
		setError(null);
		setPdf(null);
		setNumPages(0);

		pdfjsLib
			.getDocument(pdfPath)
			.promise.then((loadedPdf) => {
				if (cancelled) return;
				setPdf(loadedPdf);
				setNumPages(loadedPdf.numPages);
			})
			.catch((err) => {
				if (!cancelled) {
					console.error("Failed to load PDF:", err);
					setError("errorLoad");
				}
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [pdfPath]);

	return { pdf, numPages, isLoading, error };
}
