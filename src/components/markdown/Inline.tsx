"use client";

import type { InlineNode } from "@/lib/markdown/types";

interface InlineProps {
	nodes: InlineNode[];
	accentColor: string;
}

export function Inline({ nodes, accentColor }: InlineProps) {
	return (
		<>
			{nodes.map((node, i) => {
				switch (node.type) {
					case "text":
						return <span key={i}>{node.value}</span>;

					case "bold":
						return (
							<strong
								key={i}
								className="font-semibold"
								style={{ color: "var(--text-primary)" }}
							>
								<Inline nodes={node.children} accentColor={accentColor} />
							</strong>
						);

					case "italic":
						return (
							<em key={i} className="italic">
								<Inline nodes={node.children} accentColor={accentColor} />
							</em>
						);

					case "code":
						return (
							<code
								key={i}
								className="px-1 py-0.5 rounded text-[11px] font-mono"
								style={{
									background: "var(--surface-secondary)",
									border: "1px solid var(--border)",
									color: accentColor,
								}}
							>
								{node.value}
							</code>
						);

					case "link": {
						const isExternal =
							node.href.startsWith("http://") ||
							node.href.startsWith("https://");
						return (
							<a
								key={i}
								href={node.href}
								target={isExternal ? "_blank" : undefined}
								rel={isExternal ? "noreferrer" : undefined}
								className="underline underline-offset-2 transition-opacity hover:opacity-70"
								style={{ color: accentColor }}
								title={node.href}
							>
								<Inline nodes={node.children} accentColor={accentColor} />
							</a>
						);
					}

					case "image":
						// Inline images are mostly README badges: keep their intrinsic
						// size (next/image forces fixed dimensions → 400px-wide badges).
						return (
							// biome-ignore lint/performance/noImgElement: intrinsic-size inline images (badges)
							<img
								key={i}
								src={node.src}
								alt={node.alt}
								loading="lazy"
								decoding="async"
								className="inline-block max-w-full h-auto align-middle"
							/>
						);

					default:
						return null;
				}
			})}
		</>
	);
}
