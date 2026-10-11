import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
			className={cn("border-t border-(--site-line) py-16 sm:py-20", className)}
		>
			<div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
				<h2
					id={id}
					className="text-[1.75rem] font-light leading-tight tracking-[-0.01em] text-(--site-ink) sm:text-[2rem]"
				>
					{title}
				</h2>
				{action}
			</div>
			{children}
		</section>
	);
}
