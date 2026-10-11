"use client";

import { useTranslations } from "next-intl";
import type { TocEntry } from "@/lib/markdown/types";
import { cn } from "@/lib/utils";
import { MARKDOWN_STYLES, type MarkdownSize } from "./styles";

interface TocProps {
	entries: TocEntry[];
	activeId: string | null;
	onNavigate: (id: string) => void;
	size?: MarkdownSize;
}

const INDENT = { 1: "pl-0", 2: "pl-2", 3: "pl-4" } as const;

export function TableOfContents({
	entries,
	activeId,
	onNavigate,
	size = "compact",
}: TocProps) {
	const t = useTranslations("Content");
	const styles = MARKDOWN_STYLES[size];
	if (entries.length < 2) return null;

	return (
		<nav
			className={cn(
				"shrink-0 hidden lg:block sticky self-start pt-1",
				styles.toc,
			)}
			aria-label={t("tableOfContents")}
		>
			<p className={styles.tocTitle}>{t("tableOfContents")}</p>
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
								className={cn(
									"block w-full text-left leading-snug truncate transition-colors",
									styles.tocLink,
									INDENT[entry.level],
									isActive
										? "text-(--accent) font-medium"
										: "text-(--text-muted) hover:text-(--text-secondary)",
								)}
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
