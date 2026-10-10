import type { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist";
import { useEffect, useState } from "react";

// pdfjs-dist evaluates `new DOMMatrix()` at import time, which crashes on
// the server — so the runtime module is imported lazily in the effect. The
// type-only import above is erased at build time and costs nothing.

export type { PDFDocumentProxy };

interface PdfState {
	pdf: PDFDocumentProxy | null;
	isLoading: boolean;
	failed: boolean;
}

export function usePdfLoader(url: string | null): PdfState {
	const [state, setState] = useState<PdfState>({
		pdf: null,
		isLoading: true,
		failed: false,
	});

	useEffect(() => {
		let cancelled = false;
		let task: PDFDocumentLoadingTask | null = null;
		if (!url) {
			setState({ pdf: null, isLoading: false, failed: true });
			return;
		}
		setState({ pdf: null, isLoading: true, failed: false });

		import("pdfjs-dist")
			.then((pdfjs) => {
				if (cancelled) return;
				pdfjs.GlobalWorkerOptions.workerSrc ||= new URL(
					"pdfjs-dist/build/pdf.worker.min.mjs",
					import.meta.url,
				).toString();
				task = pdfjs.getDocument({ url });
				return task.promise;
			})
			.then((pdf) => {
				if (!cancelled && pdf)
					setState({ pdf, isLoading: false, failed: false });
			})
			.catch((error: unknown) => {
				if (cancelled) return;
				console.error("Failed to load PDF:", error);
				setState({ pdf: null, isLoading: false, failed: true });
			});

		return () => {
			cancelled = true;
			// Tears down the document AND its worker — they used to leak on
			// every language switch or window close.
			void task?.destroy();
		};
	}, [url]);

	return state;
}
