"use client";

import { useTranslations } from "next-intl";
import type { TocEntry } from "@/lib/markdown/types";
import { cn } from "@/lib/utils";

interface TocProps {
	entries: TocEntry[];
	activeId: string | null;
	onNavigate: (id: string) => void;
	/** Hide the "Contents" heading (when something else already names it). */
	hideTitle?: boolean;
	className?: string;
}

/**
 * The article's sections on a rule; the one being read is marked in the
 * item's accent. Entries are real anchors: crawlable, shareable, and they
 * still work before hydration.
 */
export function TableOfContents({
	entries,
	activeId,
	onNavigate,
	hideTitle,
	className,
}: TocProps) {
	const t = useTranslations("Content");
	if (entries.length < 2) return null;

	return (
		<nav aria-label={t("tableOfContents")} className={className}>
			{!hideTitle && (
				<p className="mb-3 font-medium text-(--text-primary)">
					{t("tableOfContents")}
				</p>
			)}
			<ol className="border-l border-(--border)">
				{entries.map((entry) => {
					const active = entry.id === activeId;
					return (
						<li key={entry.id}>
							<a
								href={`#${entry.id}`}
								onClick={(e) => {
									if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0)
										return;
									e.preventDefault();
									onNavigate(entry.id);
								}}
								aria-current={active ? "location" : undefined}
								className={cn(
									"-ml-px block border-l-2 py-[0.3em] pr-2 leading-snug transition-colors",
									entry.level === 3 ? "pl-[1.75em]" : "pl-[0.9em]",
									active
										? "border-(--accent) text-(--text-primary)"
										: "border-transparent text-(--text-muted) hover:text-(--text-primary)",
								)}
							>
								{entry.text}
							</a>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
