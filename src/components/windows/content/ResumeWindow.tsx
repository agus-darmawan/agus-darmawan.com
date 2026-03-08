"use client";

import {
	ChevronLeft,
	ChevronRight,
	Download,
	Loader2,
	Minus,
	Plus,
	RotateCcw,
} from "lucide-react";
import { useParams } from "next/navigation";
import * as pdfjsLib from "pdfjs-dist";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── PDF.js Worker ────────────────────────────────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url,
).toString();

// ─── TYPES ────────────────────────────────────────────────────────────────────
type PDFDocumentProxy = Awaited<
	ReturnType<typeof pdfjsLib.getDocument>["promise"]
>;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ACCENT = "#1d4ed8";
const DEVICE_PIXEL_RATIO =
	typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

interface ToolbarButtonProps {
	onClick: () => void;
	disabled?: boolean;
	title?: string;
	"aria-label"?: string;
	children: React.ReactNode;
	className?: string;
}

function ToolbarButton({
	onClick,
	disabled,
	title,
	"aria-label": ariaLabel,
	children,
	className = "",
}: ToolbarButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			title={title}
			aria-label={ariaLabel}
			className={`p-1.5 rounded transition-colors hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
			style={{ color: "var(--text-primary)" }}
		>
			{children}
		</button>
	);
}

function Divider() {
	return (
		<div className="w-px h-4 mx-1" style={{ background: "var(--border)" }} />
	);
}

// ─── PAGE CANVAS ──────────────────────────────────────────────────────────────

interface PageCanvasProps {
	pdf: PDFDocumentProxy;
	pageNumber: number;
	zoom: number;
	canvasRef: (el: HTMLCanvasElement | null) => void;
}

function PageCanvas({ pdf, pageNumber, zoom, canvasRef }: PageCanvasProps) {
	const localRef = useRef<HTMLCanvasElement | null>(null);
	const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

	useEffect(() => {
		const canvas = localRef.current;
		if (!canvas) return;

		let cancelled = false;

		const render = async () => {
			// Cancel previous render task
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
			style={{
				boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
				borderRadius: 2,
				display: "block",
			}}
		/>
	);
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ResumeWindow() {
	const params = useParams();
	const locale = (params?.locale as string) ?? "en";
	const pdfPath = `/resume/resume_${locale}.pdf`;

	const [zoom, setZoom] = useState(1);
	const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
	const [numPages, setNumPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);

	// ── Zoom controls ──────────────────────────────────────────────────────────
	const zoomIn = useCallback(
		() => setZoom((z) => Math.min(+(z + 0.15).toFixed(2), 3)),
		[],
	);
	const zoomOut = useCallback(
		() => setZoom((z) => Math.max(+(z - 0.15).toFixed(2), 0.4)),
		[],
	);
	const resetZoom = useCallback(() => setZoom(1), []);

	// ── Load PDF ───────────────────────────────────────────────────────────────
	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);
		setError(null);
		setPdf(null);
		setNumPages(0);
		setCurrentPage(1);

		pdfjsLib
			.getDocument(pdfPath)
			.promise.then((loadedPdf) => {
				if (cancelled) return;
				setPdf(loadedPdf);
				setNumPages(loadedPdf.numPages);
				canvasRefs.current = new Array(loadedPdf.numPages).fill(null);
			})
			.catch((err) => {
				if (!cancelled) {
					console.error("Failed to load PDF:", err);
					setError("Failed to load PDF. Make sure the file exists in /public.");
				}
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [pdfPath]);

	// ── Track current page on scroll ───────────────────────────────────────────
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleScroll = () => {
			const containerTop = container.getBoundingClientRect().top;
			for (let i = 0; i < canvasRefs.current.length; i++) {
				const canvas = canvasRefs.current[i];
				if (!canvas) continue;
				const { top, height } = canvas.getBoundingClientRect();
				if (top - containerTop > -(height / 2)) {
					setCurrentPage(i + 1);
					break;
				}
			}
		};

		container.addEventListener("scroll", handleScroll, { passive: true });
		return () => container.removeEventListener("scroll", handleScroll);
	}, []);

	// ── Page navigation ────────────────────────────────────────────────────────
	const goToPage = useCallback((page: number) => {
		const target = Math.max(1, Math.min(page, canvasRefs.current.length));
		canvasRefs.current[target - 1]?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
		setCurrentPage(target);
	}, []);

	// ── Download ───────────────────────────────────────────────────────────────
	const handleDownload = useCallback(() => {
		const a = document.createElement("a");
		a.href = pdfPath;
		a.download = `resume_${locale}.pdf`;
		a.click();
	}, [pdfPath, locale]);

	// ─── RENDER ────────────────────────────────────────────────────────────────
	return (
		<div
			className="h-full flex flex-col"
			style={{ background: "var(--window-bg)", color: "var(--text-primary)" }}
		>
			{/* ── Toolbar ── */}
			<div
				className="flex items-center justify-between px-4 py-2 shrink-0 border-b"
				style={{
					background: "var(--surface-secondary)",
					borderColor: "var(--border)",
				}}
			>
				<div className="flex items-center gap-1">
					{/* Zoom */}
					<ToolbarButton
						onClick={zoomOut}
						disabled={zoom <= 0.4}
						title="Zoom out"
						aria-label="Zoom out"
					>
						<Minus size={14} />
					</ToolbarButton>

					<button
						type="button"
						onClick={resetZoom}
						title="Reset zoom"
						className="px-2 py-1 rounded text-xs tabular-nums min-w-12 text-center"
						style={{
							color: "var(--text-secondary)",
							background: "var(--border)",
						}}
					>
						{Math.round(zoom * 100)}%
					</button>

					<ToolbarButton
						onClick={zoomIn}
						disabled={zoom >= 3}
						title="Zoom in"
						aria-label="Zoom in"
					>
						<Plus size={14} />
					</ToolbarButton>

					<Divider />

					<ToolbarButton
						onClick={resetZoom}
						title="Reset zoom"
						aria-label="Reset zoom"
					>
						<RotateCcw size={13} />
					</ToolbarButton>

					{/* Page navigation */}
					{numPages > 1 && (
						<>
							<Divider />

							<ToolbarButton
								onClick={() => goToPage(currentPage - 1)}
								disabled={currentPage <= 1}
								title="Previous page"
								aria-label="Previous page"
							>
								<ChevronLeft size={14} />
							</ToolbarButton>

							<span
								className="text-xs px-1 tabular-nums"
								style={{ color: "var(--text-secondary)" }}
							>
								{currentPage} / {numPages}
							</span>

							<ToolbarButton
								onClick={() => goToPage(currentPage + 1)}
								disabled={currentPage >= numPages}
								title="Next page"
								aria-label="Next page"
							>
								<ChevronRight size={14} />
							</ToolbarButton>
						</>
					)}
				</div>

				{/* Download */}
				<button
					type="button"
					onClick={handleDownload}
					title="Download resume PDF"
					aria-label="Download resume PDF"
					className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white transition-opacity hover:opacity-90"
					style={{ background: ACCENT }}
				>
					<Download size={12} />
					Download PDF
				</button>
			</div>

			{/* ── Canvas viewer ── */}
			<div
				ref={containerRef}
				className="flex-1 overflow-auto"
				style={{ background: "#525659" }}
			>
				<div className="py-6 px-4 flex flex-col items-center gap-5">
					{/* Loading */}
					{isLoading && (
						<div className="flex flex-col items-center justify-center gap-3 mt-24">
							<Loader2
								size={28}
								className="animate-spin"
								style={{ color: "#aaa" }}
							/>
							<p className="text-sm" style={{ color: "#bbb" }}>
								Loading PDF…
							</p>
						</div>
					)}

					{/* Error */}
					{error && !isLoading && (
						<div
							className="mt-24 px-6 py-4 rounded text-sm text-center max-w-sm"
							style={{ background: "#3a1a1a", color: "#f87171" }}
						>
							{error}
						</div>
					)}

					{/* Pages */}
					{pdf &&
						Array.from({ length: numPages }, (_, i) => (
							<PageCanvas
								key={`page-${i + 1}`}
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
		</div>
	);
}
