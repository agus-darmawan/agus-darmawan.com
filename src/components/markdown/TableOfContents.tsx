"use client";

import { useTranslations } from "next-intl";
import type { TocEntry } from "@/lib/markdown/types";

interface TocProps {
	entries: TocEntry[];
	accentColor: string;
	activeId: string | null;
	onNavigate: (id: string) => void;
}

const INDENT = { 1: 0, 2: 8, 3: 16 } as const;

export function TableOfContents({
	entries,
	accentColor,
	activeId,
	onNavigate,
}: TocProps) {
	const t = useTranslations("Content");
	if (entries.length < 2) return null;

	return (
		<nav
			className="shrink-0 w-44 hidden lg:block sticky top-0 self-start pt-1"
			aria-label={t("tableOfContents")}
		>
			<p className="text-[10px] font-semibold uppercase tracking-widest mb-2 text-(--text-muted)">
				{t("tableOfContents")}
			</p>
			<ul className="space-y-0.5">
				{entries.map((entry) => {
					const isActive = activeId === entry.id;
					return (
						<li key={entry.id}>
							{/* Real anchors: crawlable, middle-clickable, shareable. */}
							<a
								href={`#${entry.id}`}
								onClick={(e) => {
									e.preventDefault();
									onNavigate(entry.id);
								}}
								aria-current={isActive ? "location" : undefined}
								className="block w-full text-left text-[11px] leading-snug py-0.5 truncate transition-colors"
								style={{
									paddingLeft: INDENT[entry.level],
									color: isActive ? accentColor : "var(--text-muted)",
									fontWeight: isActive ? 500 : 400,
								}}
							>
								{entry.text}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
