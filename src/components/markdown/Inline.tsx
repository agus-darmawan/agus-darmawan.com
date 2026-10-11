"use client";

import type { InlineNode } from "@/lib/markdown/types";

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Inline markdown. Static parsed nodes — the index is a stable key. */
export function Inline({ nodes }: { nodes: InlineNode[] }) {
	return nodes.map((node, i) => {
		switch (node.type) {
			case "text":
				return <span key={i}>{node.value}</span>;
			case "bold":
				return (
					<strong key={i} className="font-semibold text-(--text-primary)">
						<Inline nodes={node.children} />
					</strong>
				);
			case "italic":
				return (
					<em key={i} className="italic">
						<Inline nodes={node.children} />
					</em>
				);
			case "code":
				return (
					<code
						key={i}
						className="px-1 py-0.5 rounded text-[0.88em] font-mono bg-(--surface-secondary) border border-(--border) text-(--accent)"
					>
						{node.value}
					</code>
				);
			case "link": {
				const external = isExternal(node.href);
				return (
					<a
						key={i}
						href={node.href}
						target={external ? "_blank" : undefined}
						rel={external ? "noreferrer" : undefined}
						className="underline underline-offset-2 transition-opacity hover:opacity-70 text-(--accent)"
						title={node.href}
					>
						<Inline nodes={node.children} />
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
	});
}
