"use client";

import NextImage from "next/image";
import type { InlineNode } from "./types";

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
							>
								<Inline nodes={node.children} accentColor={accentColor} />
							</a>
						);
					}

					case "image":
						return (
							<NextImage
								key={i}
								src={node.src}
								alt={node.alt}
								width={400}
								height={300}
								className="inline-block max-w-full rounded-lg"
								unoptimized
							/>
						);

					default:
						return null;
				}
			})}
		</>
	);
}
