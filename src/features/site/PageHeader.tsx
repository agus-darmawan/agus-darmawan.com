import type { ReactNode } from "react";
import { DISPLAY_HEADING } from "./typography";

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
			<h1 className={DISPLAY_HEADING}>{title}</h1>
			{lede && (
				<p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-(--site-muted)">
					{lede}
				</p>
			)}
			{children}
		</header>
	);
}
