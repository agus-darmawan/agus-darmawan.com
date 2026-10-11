import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DISPLAY_HEADING, LEDE } from "./typography";

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
		<header className="pb-10 pt-12 sm:pb-12 sm:pt-16">
			<h1 className={DISPLAY_HEADING}>{title}</h1>
			{lede && <p className={cn(LEDE, "mt-4 max-w-[60ch]")}>{lede}</p>}
			{children}
		</header>
	);
}
