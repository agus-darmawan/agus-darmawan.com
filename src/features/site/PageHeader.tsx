import type { ReactNode } from "react";

/** H1 + lede that opens every top-level page. */
export function PageHeader({
	title,
	lede,
	children,
}: {
	title: string;
	lede?: string;
	children?: ReactNode;
}) {
	return (
		<header className="pb-10 pt-14 sm:pb-14 sm:pt-20">
			<h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-light leading-[1.08] tracking-[-0.02em] text-(--site-ink)">
				{title}
			</h1>
			{lede && (
				<p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-(--site-muted)">
					{lede}
				</p>
			)}
			{children}
		</header>
	);
}
