"use client";

import type { Token } from "@/lib/markdown/types";
import { CodeBlock } from "./CodeBlock";
import { ImageBlock } from "./ImageBlock";
import { Inline } from "./Inline";
import { YoutubeBlock } from "./YoutubeBlock";

const BULLET = "shrink-0 mt-0.5 text-[10px] text-(--accent)";
const ITEM = "flex gap-2 text-xs text-(--text-secondary)";
const CELL = "px-3 py-1.5 border border-(--border)";

/**
 * Block-level markdown. A parsed document is static — tokens are never
 * reordered or inserted — so their index is a stable key.
 */
export function MarkdownBlocks({ tokens }: { tokens: Token[] }) {
	return tokens.map((token, idx) => {
		switch (token.type) {
			case "h1":
				return (
					<h1
						key={idx}
						id={token.id}
						className="text-lg font-bold mb-2 mt-5 first:mt-0 pb-2 border-b border-(--border) text-(--text-primary)"
					>
						<Inline nodes={token.children} />
					</h1>
				);
			case "h2":
				return (
					<h2
						key={idx}
						id={token.id}
						className="text-sm font-semibold mt-5 mb-2 text-(--accent)"
					>
						<Inline nodes={token.children} />
					</h2>
				);
			case "h3":
				return (
					<h3
						key={idx}
						id={token.id}
						className="text-xs font-semibold mt-4 mb-1 text-(--text-primary)"
					>
						<Inline nodes={token.children} />
					</h3>
				);
			case "p":
				return (
					<p
						key={idx}
						className="text-xs leading-relaxed my-1.5 text-(--text-secondary)"
					>
						<Inline nodes={token.children} />
					</p>
				);
			case "blockquote":
				return (
					<blockquote
						key={idx}
						className="pl-3 my-3 text-xs italic border-l-3 border-(--accent) text-(--text-muted)"
					>
						<MarkdownBlocks tokens={token.children} />
					</blockquote>
				);
			case "code_block":
				return <CodeBlock key={idx} lang={token.lang} code={token.code} />;
			case "image":
				return (
					<ImageBlock
						key={idx}
						src={token.src}
						alt={token.alt}
						title={token.title}
					/>
				);
			case "youtube":
				return (
					<YoutubeBlock key={idx} videoId={token.videoId} title={token.title} />
				);
			case "table":
				return (
					<div key={idx} className="overflow-x-auto my-3">
						<table className="w-full text-xs border-collapse">
							<thead>
								<tr className="bg-(--accent)/7">
									{token.headers.map((cell, i) => (
										<th
											key={i}
											scope="col"
											className={`${CELL} text-left font-semibold text-(--accent)`}
										>
											<Inline nodes={cell} />
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{token.rows.map((row, r) => (
									<tr key={r} className="even:bg-(--surface-secondary)">
										{row.map((cell, c) => (
											<td key={c} className={`${CELL} text-(--text-secondary)`}>
												<Inline nodes={cell} />
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				);
			case "ul":
				return (
					<ul key={idx} className="my-2 space-y-1 pl-1">
						{token.items.map((item, i) => (
							<li key={i} className={ITEM}>
								<span aria-hidden className={BULLET}>
									▸
								</span>
								<span>
									<Inline nodes={item} />
								</span>
							</li>
						))}
					</ul>
				);
			case "ol":
				return (
					<ol key={idx} className="my-2 space-y-1 pl-1">
						{token.items.map((item, i) => (
							<li key={i} className={ITEM}>
								<span
									aria-hidden
									className={`${BULLET} font-medium tabular-nums min-w-4`}
								>
									{i + 1}.
								</span>
								<span>
									<Inline nodes={item} />
								</span>
							</li>
						))}
					</ol>
				);
			case "hr":
				return <hr key={idx} className="my-4 border-(--border)" />;
			default:
				return null;
		}
	});
}
