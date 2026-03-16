"use client";

import {
	ChevronLeft,
	ChevronRight,
	Download,
	Minus,
	Plus,
	RotateCcw,
} from "lucide-react";

const ACCENT = "#1d4ed8";

interface ToolbarButtonProps {
	onClick: () => void;
	disabled?: boolean;
	title?: string;
	"aria-label"?: string;
	children: React.ReactNode;
}

function ToolbarButton({
	onClick,
	disabled,
	title,
	"aria-label": ariaLabel,
	children,
}: ToolbarButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			title={title}
			aria-label={ariaLabel}
			className="p-1.5 rounded transition-colors hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed"
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

interface ResumeToolbarProps {
	zoom: number;
	numPages: number;
	currentPage: number;
	onZoomIn: () => void;
	onZoomOut: () => void;
	onResetZoom: () => void;
	onPrevPage: () => void;
	onNextPage: () => void;
	onDownload: () => void;
	t: (key: string) => string;
}

export function ResumeToolbar({
	zoom,
	numPages,
	currentPage,
	onZoomIn,
	onZoomOut,
	onResetZoom,
	onPrevPage,
	onNextPage,
	onDownload,
	t,
}: ResumeToolbarProps) {
	return (
		<div
			className="flex items-center justify-between px-4 py-2 shrink-0 border-b"
			style={{
				background: "var(--surface-secondary)",
				borderColor: "var(--border)",
			}}
		>
			<div className="flex items-center gap-1">
				<ToolbarButton
					onClick={onZoomOut}
					disabled={zoom <= 0.4}
					title={t("zoomOut")}
					aria-label={t("zoomOut")}
				>
					<Minus size={14} />
				</ToolbarButton>

				<button
					type="button"
					onClick={onResetZoom}
					title={t("resetZoom")}
					className="px-2 py-1 rounded text-xs tabular-nums min-w-12 text-center"
					style={{
						color: "var(--text-secondary)",
						background: "var(--border)",
					}}
				>
					{Math.round(zoom * 100)}%
				</button>

				<ToolbarButton
					onClick={onZoomIn}
					disabled={zoom >= 3}
					title={t("zoomIn")}
					aria-label={t("zoomIn")}
				>
					<Plus size={14} />
				</ToolbarButton>

				<Divider />

				<ToolbarButton
					onClick={onResetZoom}
					title={t("resetZoom")}
					aria-label={t("resetZoom")}
				>
					<RotateCcw size={13} />
				</ToolbarButton>

				{numPages > 1 && (
					<>
						<Divider />
						<ToolbarButton
							onClick={onPrevPage}
							disabled={currentPage <= 1}
							title={t("prevPage")}
							aria-label={t("prevPage")}
						>
							<ChevronLeft size={14} />
						</ToolbarButton>

						<span
							className="text-xs px-1 tabular-nums"
							style={{ color: "var(--text-secondary)" }}
						>
							{currentPage} {t("pageOf")} {numPages}
						</span>

						<ToolbarButton
							onClick={onNextPage}
							disabled={currentPage >= numPages}
							title={t("nextPage")}
							aria-label={t("nextPage")}
						>
							<ChevronRight size={14} />
						</ToolbarButton>
					</>
				)}
			</div>

			<button
				type="button"
				onClick={onDownload}
				title={t("download")}
				aria-label={t("download")}
				className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white transition-opacity hover:opacity-90"
				style={{ background: ACCENT }}
			>
				<Download size={12} />
				{t("download")}
			</button>
		</div>
	);
}
