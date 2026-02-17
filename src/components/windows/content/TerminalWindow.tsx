"use client";

import { useTranslations } from "next-intl";

export default function TerminalWindow() {
	const t = useTranslations("TerminalWindow");

	return (
		<div
			className="h-full flex flex-col font-mono text-sm p-4"
			style={{ background: "#300a24", color: "#d3d7cf" }}
		>
			<div className="mb-2 text-xs opacity-50">{t("title")}</div>
			<div className="flex items-center gap-1">
				<span style={{ color: "#4e9a06" }}>agus@ubuntu</span>
				<span>:</span>
				<span style={{ color: "#3465a4" }}>~</span>
				<span>$</span>
				<span className="ml-1 animate-pulse">▋</span>
			</div>
		</div>
	);
}
