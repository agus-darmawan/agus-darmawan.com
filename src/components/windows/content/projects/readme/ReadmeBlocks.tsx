"use client";

import type { Token } from "@/types/project";
import { CodeBlock } from "./CodeBlock";
import { ImageBlock } from "./ImageBlock";
import { Inline } from "./Inline";
import { YoutubeBlock } from "./YoutubeBlock";

interface ReadmeBlocksProps {
	tokens: Token[];
	accentColor: string;
}

export function ReadmeBlocks({ tokens, accentColor }: ReadmeBlocksProps) {
	return (
		<>
			{tokens.map((token, idx) => {
				switch (token.type) {
					case "h1":
						return (
							<h1
								key={idx}
								id={token.id}
								className="text-lg font-bold mb-2 mt-5 first:mt-0 pb-2 border-b"
								style={{
									color: "var(--text-primary)",
									borderColor: "var(--border)",
								}}
							>
								<Inline nodes={token.children} accentColor={accentColor} />
							</h1>
						);

					case "h2":
						return (
							<h2
								key={idx}
								id={token.id}
								className="text-sm font-semibold mt-5 mb-2"
								style={{ color: accentColor }}
							>
								<Inline nodes={token.children} accentColor={accentColor} />
							</h2>
						);

					case "h3":
						return (
							<h3
								key={idx}
								id={token.id}
								className="text-xs font-semibold mt-4 mb-1"
								style={{ color: "var(--text-primary)" }}
							>
								<Inline nodes={token.children} accentColor={accentColor} />
							</h3>
						);

					case "p":
						return (
							<p
								key={idx}
								className="text-xs leading-relaxed my-1.5"
								style={{ color: "var(--text-secondary)" }}
							>
								<Inline nodes={token.children} accentColor={accentColor} />
							</p>
						);

					case "blockquote":
						return (
							<blockquote
								key={idx}
								className="pl-3 my-3 text-xs italic"
								style={{
									borderLeft: `3px solid ${accentColor}`,
									color: "var(--text-muted)",
								}}
							>
								<ReadmeBlocks
									tokens={token.children}
									accentColor={accentColor}
								/>
							</blockquote>
						);

					case "code_block":
						return (
							<CodeBlock
								key={idx}
								lang={token.lang}
								code={token.code}
								accentColor={accentColor}
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
							<YoutubeBlock
								key={idx}
								videoId={token.videoId}
								title={token.title}
								accentColor={accentColor}
							/>
						);

					case "table":
						return (
							<div key={idx} className="overflow-x-auto my-3">
								<table className="w-full text-xs border-collapse">
									<thead>
										<tr style={{ background: `${accentColor}12` }}>
											{token.headers.map((h, hIdx) => (
												<th
													key={hIdx}
													className="text-left px-3 py-1.5 font-semibold border"
													style={{
														borderColor: "var(--border)",
														color: accentColor,
													}}
												>
													<Inline nodes={h} accentColor={accentColor} />
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{token.rows.map((row, rIdx) => (
											<tr
												key={rIdx}
												style={{
													background:
														rIdx % 2 === 0
															? "transparent"
															: "var(--surface-secondary)",
												}}
											>
												{row.map((cell, cIdx) => (
													<td
														key={cIdx}
														className="px-3 py-1.5 border"
														style={{
															borderColor: "var(--border)",
															color: "var(--text-secondary)",
														}}
													>
														<Inline nodes={cell} accentColor={accentColor} />
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
								{token.items.map((item, iIdx) => (
									<li
										key={iIdx}
										className="flex gap-2 text-xs"
										style={{ color: "var(--text-secondary)" }}
									>
										<span
											className="shrink-0 mt-0.5 text-[10px]"
											style={{ color: accentColor }}
										>
											▸
										</span>
										<span>
											<Inline nodes={item} accentColor={accentColor} />
										</span>
									</li>
								))}
							</ul>
						);

					case "ol":
						return (
							<ol key={idx} className="my-2 space-y-1 pl-1">
								{token.items.map((item, iIdx) => (
									<li
										key={iIdx}
										className="flex gap-2 text-xs"
										style={{ color: "var(--text-secondary)" }}
									>
										<span
											className="shrink-0 mt-0.5 text-[10px] font-medium tabular-nums min-w-4"
											style={{ color: accentColor }}
										>
											{iIdx + 1}.
										</span>
										<span>
											<Inline nodes={item} accentColor={accentColor} />
										</span>
									</li>
								))}
							</ol>
						);

					case "hr":
						return (
							<hr
								key={idx}
								className="my-4"
								style={{ borderColor: "var(--border)" }}
							/>
						);

					case "blank":
						return null;

					default:
						return null;
				}
			})}
		</>
	);
}
