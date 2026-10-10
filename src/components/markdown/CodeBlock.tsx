"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { highlight } from "@/lib/markdown/highlight";

interface CodeBlockProps {
	lang: string;
	code: string;
}

export function CodeBlock({ lang, code }: CodeBlockProps) {
	const t = useTranslations("Content");
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const id = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(id);
	}, [copied]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
		} catch {
			// Clipboard blocked (insecure context / permissions) — fail silently.
		}
	};

	return (
		<div className="rounded-xl overflow-hidden my-3 border border-(--border)">
			<div className="flex items-center justify-between px-3 py-1.5 bg-(--surface-secondary) border-b border-(--border)">
				<span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-(--accent)/10 text-(--accent) border border-(--accent)/20">
					{lang || "text"}
				</span>

				<button
					type="button"
					onClick={handleCopy}
					aria-label={t("copyCode")}
					className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded transition-colors hover:bg-(--border) ${copied ? "text-[#50fa7b]" : "text-(--text-muted)"}`}
				>
					{copied ? (
						<Check size={11} aria-hidden />
					) : (
						<Copy size={11} aria-hidden />
					)}
					{copied ? t("copied") : t("copy")}
				</button>
			</div>

			<pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed m-0 bg-[#1a1a2e] text-[#f8f8f2]">
				<code
					// biome-ignore lint/security/noDangerouslySetInnerHtml: highlight() HTML-escapes every slice of the source
					dangerouslySetInnerHTML={{ __html: highlight(code, lang) }}
				/>
			</pre>
		</div>
	);
}
