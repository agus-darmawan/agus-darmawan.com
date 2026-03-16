"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

// pdfjs-dist calls `new DOMMatrix()` at module-evaluation time,
// which crashes in Node/SSR. Dynamic import with ssr:false defers
// the entire module until it runs in the browser.
const ResumeViewerClient = dynamic(() => import("./ResumeViewerClient"), {
	ssr: false,
	loading: () => (
		<div className="h-full flex items-center justify-center bg-[#525659]">
			<div className="flex flex-col items-center gap-3">
				<div className="w-7 h-7 rounded-full border-2 border-zinc-400 border-t-transparent animate-spin" />
				<p className="text-sm text-zinc-300">Loading PDF viewer…</p>
			</div>
		</div>
	),
});

export default function ResumeWindow() {
	const t = useTranslations("ResumeWindow");
	return <ResumeViewerClient t={t} />;
}
