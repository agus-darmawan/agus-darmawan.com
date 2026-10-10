import type { ReactNode } from "react";

/** Titled block used by every About section (window + /about page). */
export function AboutSection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section className="px-6 py-5 border-b border-(--border)">
			<h2 className="text-xs font-semibold uppercase tracking-wider mb-4 text-(--text-muted)">
				{title}
			</h2>
			{children}
		</section>
	);
}
