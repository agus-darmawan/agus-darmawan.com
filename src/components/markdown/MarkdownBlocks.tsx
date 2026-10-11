"use client";

import type { Token } from "@/lib/markdown/types";
import { CodeBlock } from "./CodeBlock";
import { ImageBlock } from "./ImageBlock";
import { Inline } from "./Inline";
import { MARKDOWN_STYLES, type MarkdownSize } from "./styles";
import { YoutubeBlock } from "./YoutubeBlock";

/**
 * Block-level markdown. A parsed document is static — tokens are never
 * reordered or inserted — so their index is a stable key.
 */
export function MarkdownBlocks({
	tokens,
	size = "compact",
}: {
	tokens: Token[];
	size?: MarkdownSize;
}) {
	const s = MARKDOWN_STYLES[size];
	return tokens.map((token, idx) => {
		switch (token.type) {
			case "h1":
				return (
					<h1 key={idx} id={token.id} className={s.h1}>
						<Inline nodes={token.children} />
					</h1>
				);
			case "h2":
				return (
					<h2 key={idx} id={token.id} className={s.h2}>
						<Inline nodes={token.children} />
					</h2>
				);
			case "h3":
				return (
					<h3 key={idx} id={token.id} className={s.h3}>
						<Inline nodes={token.children} />
					</h3>
				);
			case "p":
				return (
					<p key={idx} className={s.p}>
						<Inline nodes={token.children} />
					</p>
				);
			case "blockquote":
				return (
					<blockquote key={idx} className={s.quote}>
						<MarkdownBlocks tokens={token.children} size={size} />
					</blockquote>
				);
			case "code_block":
				return (
					<CodeBlock
						key={idx}
						lang={token.lang}
						code={token.code}
						className={s.code}
					/>
				);
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
					<div key={idx} className={s.tableWrap}>
						<table className={s.table}>
							<thead>
								<tr className="bg-(--accent)/7">
									{token.headers.map((cell, i) => (
										<th
											key={i}
											scope="col"
											className={`${s.cell} text-left font-semibold text-(--accent)`}
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
											<td
												key={c}
												className={`${s.cell} text-(--text-secondary)`}
											>
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
					<ul key={idx} className={s.list}>
						{token.items.map((item, i) => (
							<li key={i} className={s.item}>
								<span aria-hidden className={s.bullet}>
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
					<ol key={idx} className={s.list}>
						{token.items.map((item, i) => (
							<li key={i} className={s.item}>
								<span
									aria-hidden
									className={`${s.bullet} font-medium tabular-nums min-w-4`}
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
				return <hr key={idx} className={s.hr} />;
			default:
				return null;
		}
	});
}
