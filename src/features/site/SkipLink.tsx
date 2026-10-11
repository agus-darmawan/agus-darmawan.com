"use client";

import type { ReactNode } from "react";

/**
 * Moves focus to the main content. Handled in script: a plain `#content`
 * jump adds a history entry the Next router can't restore, so Back would
 * change the URL without changing the page.
 */
export function SkipLink({
	target,
	children,
}: {
	target: string;
	children: ReactNode;
}) {
	return (
		<a
			href={`#${target}`}
			onClick={(event) => {
				const main = document.getElementById(target);
				if (!main) return;
				event.preventDefault();
				main.focus({ preventScroll: true });
				main.scrollIntoView();
			}}
			className="sr-only rounded-lg bg-(--site-primary) px-4 py-2 text-sm font-medium text-(--site-on-primary) focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50"
		>
			{children}
		</a>
	);
}
