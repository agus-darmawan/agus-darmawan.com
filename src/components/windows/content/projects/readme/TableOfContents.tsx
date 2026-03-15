"use client";

import type { TocEntry } from "@/types/project";

interface TocProps {
	entries: TocEntry[];
	accentColor: string;
	activeId: string | null;
	onNavigate: (id: string) => void;
}

export function TableOfContents({
	entries,
	accentColor,
	activeId,
	onNavigate,
}: TocProps) {
	if (entries.length < 2) return null;

	return (
		<nav
			className="shrink-0 w-44 hidden lg:block sticky top-0 self-start pt-1"
			aria-label="Table of contents"
		>
			<p
				className="text-[10px] font-semibold uppercase tracking-widest mb-2"
				style={{ color: "var(--text-muted)" }}
			>
				Contents
			</p>
			<ul className="space-y-0.5">
				{entries.map((entry) => {
					const isActive = activeId === entry.id;
					return (
						<li key={entry.id}>
							<button
								type="button"
								onClick={() => onNavigate(entry.id)}
								className="w-full text-left text-[11px] leading-snug py-0.5 truncate transition-colors"
								style={{
									paddingLeft:
										entry.level === 1 ? 0 : entry.level === 2 ? 8 : 16,
									color: isActive ? accentColor : "var(--text-muted)",
									fontWeight: isActive ? 500 : 400,
								}}
							>
								{entry.text}
							</button>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
