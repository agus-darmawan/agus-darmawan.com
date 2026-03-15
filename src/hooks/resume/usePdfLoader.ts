import { useEffect, useRef, useState } from "react";

// We avoid importing pdfjs-dist at the top level because canvas.js calls
// `new DOMMatrix()` at module evaluation time, which crashes in Node/SSR.
// Using `unknown` here is intentional — the real type is only available
// after the dynamic import resolves in the browser.
export type PDFDocumentProxy = unknown;

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
	const initialised = useRef(false);

	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);
		setError(null);
		setPdf(null);
		setNumPages(0);

		// Dynamic import keeps pdfjs out of the SSR bundle entirely.
		import("pdfjs-dist").then((pdfjsLib) => {
			if (cancelled) return;

			// Configure worker only once, only in the browser.
			if (!initialised.current) {
				pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
					"pdfjs-dist/build/pdf.worker.min.mjs",
					import.meta.url,
				).toString();
				initialised.current = true;
			}

			pdfjsLib
				.getDocument(pdfPath)
				.promise.then((loadedPdf) => {
					if (cancelled) return;
					setPdf(loadedPdf);
					setNumPages(loadedPdf.numPages);
				})
				.catch((err: unknown) => {
					if (!cancelled) {
						console.error("Failed to load PDF:", err);
						setError("errorLoad");
					}
				})
				.finally(() => {
					if (!cancelled) setIsLoading(false);
				});
		});

		return () => {
			cancelled = true;
		};
	}, [pdfPath]);

	return { pdf, numPages, isLoading, error };
}
