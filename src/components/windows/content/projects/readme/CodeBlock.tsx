"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
	lang: string;
	code: string;
	accentColor: string;
}

/** Very lightweight token colorizer — no external deps */
function highlight(code: string, lang: string): string {
	if (!["js", "jsx", "ts", "tsx", "javascript", "typescript"].includes(lang)) {
		return escHtml(code);
	}

	const KEYWORDS =
		/\b(const|let|var|function|return|import|export|from|default|class|extends|new|if|else|for|while|async|await|typeof|instanceof|void|null|undefined|true|false|type|interface|enum)\b/g;
	const STRINGS = /(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g;
	const COMMENTS = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
	const NUMBERS = /\b(\d+(?:\.\d+)?)\b/g;
	const TAGS = /(&lt;\/?[A-Za-z][A-Za-z0-9]*)/g;

	let escaped = escHtml(code);

	// Order matters — comments first to avoid coloring inside them
	escaped = escaped.replace(
		COMMENTS,
		(m) => `<span style="color:#6272a4">${m}</span>`,
	);
	escaped = escaped.replace(
		STRINGS,
		(m) => `<span style="color:#f1fa8c">${m}</span>`,
	);
	escaped = escaped.replace(
		KEYWORDS,
		(_, kw) => `<span style="color:#ff79c6">${kw}</span>`,
	);
	escaped = escaped.replace(
		NUMBERS,
		(_, n) => `<span style="color:#bd93f9">${n}</span>`,
	);
	escaped = escaped.replace(
		TAGS,
		(_, t) => `<span style="color:#50fa7b">${t}</span>`,
	);

	return escaped;
}

function escHtml(str: string) {
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function CodeBlock({ lang, code, accentColor }: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div
			className="rounded-xl overflow-hidden my-3"
			style={{ border: "1px solid var(--border)" }}
		>
			{/* Header bar */}
			<div
				className="flex items-center justify-between px-3 py-1.5"
				style={{
					background: "var(--surface-secondary)",
					borderBottom: "1px solid var(--border)",
				}}
			>
				<span
					className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded"
					style={{
						background: `${accentColor}18`,
						color: accentColor,
						border: `1px solid ${accentColor}28`,
					}}
				>
					{lang || "text"}
				</span>

				<button
					type="button"
					onClick={handleCopy}
					className="flex items-center gap-1 text-[10px] px-2 py-1 rounded transition-colors"
					style={{ color: copied ? "#50fa7b" : "var(--text-muted)" }}
					title="Copy code"
				>
					{copied ? <Check size={11} /> : <Copy size={11} />}
					{copied ? "Copied!" : "Copy"}
				</button>
			</div>

			{/* Code body */}
			<pre
				className="overflow-x-auto p-4 text-xs font-mono leading-relaxed"
				style={{ background: "#1a1a2e", color: "#f8f8f2", margin: 0 }}
				dangerouslySetInnerHTML={{ __html: highlight(code, lang) }}
			/>
		</div>
	);
}
