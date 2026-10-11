"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { PdfLoading } from "./ResumeViewer";

function ViewerLoading() {
	const t = useTranslations("ResumeWindow");
	return (
		<div className="h-full flex justify-center bg-slate-500 dark:bg-[#525659]">
			<PdfLoading text={t("loadingViewer")} />
		</div>
	);
}

// pdf.js touches browser-only globals at import time: client-only chunk.
const ResumeViewerClient = dynamic(() => import("./ResumeViewerClient"), {
	ssr: false,
	loading: ViewerLoading,
});

export default function ResumeWindow() {
	return <ResumeViewerClient />;
}
