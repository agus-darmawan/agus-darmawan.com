import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SECTION_HEADING } from "./typography";

/** A home/about section: heading row (with an optional link) over content. */
export function Section({
	id,
	title,
	action,
	children,
	className,
}: {
	id: string;
	title: string;
	action?: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<section
			aria-labelledby={id}
			className={cn("border-t border-(--site-line) py-12 sm:py-16", className)}
		>
			<div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
				<h2 id={id} className={SECTION_HEADING}>
					{title}
				</h2>
				{action}
			</div>
			{children}
		</section>
	);
}
