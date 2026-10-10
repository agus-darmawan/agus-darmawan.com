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
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { ZOOM_MAX, ZOOM_MIN } from "./hooks/usePdfZoom";

function ToolbarButton({
	onClick,
	disabled,
	label,
	children,
}: {
	onClick: () => void;
	disabled?: boolean;
	label: string;
	children: ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			title={label}
			aria-label={label}
			className="p-1.5 rounded transition-colors text-(--text-primary) hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
		>
			{children}
		</button>
	);
}

const Divider = () => (
	<span aria-hidden className="w-px h-4 mx-1 bg-(--border)" />
);

interface ResumeToolbarProps {
	zoom: number;
	numPages: number;
	currentPage: number;
	downloading: boolean;
	canDownload: boolean;
	onZoomIn: () => void;
	onZoomOut: () => void;
	onResetZoom: () => void;
	onPrevPage: () => void;
	onNextPage: () => void;
	onDownload: () => void;
}

export function ResumeToolbar({
	zoom,
	numPages,
	currentPage,
	downloading,
	canDownload,
	onZoomIn,
	onZoomOut,
	onResetZoom,
	onPrevPage,
	onNextPage,
	onDownload,
}: ResumeToolbarProps) {
	const t = useTranslations("ResumeWindow");

	return (
		<div
			role="toolbar"
			aria-label={t("title")}
			className="flex items-center justify-between px-4 py-2 shrink-0 border-b bg-(--surface-secondary) border-(--border)"
		>
			<div className="flex items-center gap-1">
				<ToolbarButton
					onClick={onZoomOut}
					disabled={zoom <= ZOOM_MIN}
					label={t("zoomOut")}
				>
					<Minus size={14} aria-hidden />
				</ToolbarButton>
				<output
					aria-live="polite"
					className="px-2 py-1 rounded text-xs tabular-nums min-w-12 text-center text-(--text-secondary) bg-(--border)"
				>
					{Math.round(zoom * 100)}%
				</output>
				<ToolbarButton
					onClick={onZoomIn}
					disabled={zoom >= ZOOM_MAX}
					label={t("zoomIn")}
				>
					<Plus size={14} aria-hidden />
				</ToolbarButton>

				<Divider />

				<ToolbarButton
					onClick={onResetZoom}
					disabled={zoom === 1}
					label={t("resetZoom")}
				>
					<RotateCcw size={13} aria-hidden />
				</ToolbarButton>

				{numPages > 1 && (
					<>
						<Divider />
						<ToolbarButton
							onClick={onPrevPage}
							disabled={currentPage <= 1}
							label={t("prevPage")}
						>
							<ChevronLeft size={14} aria-hidden />
						</ToolbarButton>
						<span className="text-xs px-1 tabular-nums text-(--text-secondary)">
							{currentPage} {t("pageOf")} {numPages}
						</span>
						<ToolbarButton
							onClick={onNextPage}
							disabled={currentPage >= numPages}
							label={t("nextPage")}
						>
							<ChevronRight size={14} aria-hidden />
						</ToolbarButton>
					</>
				)}
			</div>

			<button
				type="button"
				onClick={onDownload}
				disabled={downloading || !canDownload}
				className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white transition-opacity bg-blue-700 hover:opacity-90 disabled:opacity-60"
			>
				{downloading ? (
					<Loader2 size={12} className="animate-spin" aria-hidden />
				) : (
					<Download size={12} aria-hidden />
				)}
				{t("download")}
			</button>
		</div>
	);
}
