"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useRef, useState } from "react";

interface CodeBlockProps {
	/** Display name of the language; none for plain text. */
	lang?: string;
	/** File name from the fence (`title="store.ts"`), shown instead. */
	title?: string;
	/** The highlighted `<pre>`, rendered on the server. */
	children: ReactNode;
}

/** A highlighted code block with its file name or language and a copy button. */
export function CodeBlock({ lang, title, children }: CodeBlockProps) {
	const t = useTranslations("Content");
	const body = useRef<HTMLDivElement>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const id = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(id);
	}, [copied]);

	const copy = async () => {
		// Lines are block elements without newlines between them.
		const lines = body.current?.querySelectorAll(".line") ?? [];
		const text = Array.from(lines, (line) => line.textContent ?? "").join("\n");
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
		} catch {
			// Clipboard blocked (insecure context, permissions): nothing to undo.
		}
	};

	return (
		<div className="md-code">
			<div className="md-code-bar">
				{title ? (
					<span className="md-code-title">{title}</span>
				) : (
					<span>{lang}</span>
				)}
				<button
					type="button"
					onClick={copy}
					aria-label={copied ? t("copied") : t("copyCode")}
					className="md-code-copy"
				>
					{copied ? <Check aria-hidden /> : <Copy aria-hidden />}
					<span aria-hidden>{copied ? t("copied") : t("copy")}</span>
				</button>
			</div>
			<div ref={body}>{children}</div>
		</div>
	);
}
