"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { desktopHref } from "@/lib/desktop-links";
import { rememberUiMode } from "@/lib/ui-mode";

type DesktopLinkProps = Omit<ComponentProps<typeof Link>, "href">;

/**
 * Every way into the desktop goes through this link. It remembers the
 * choice and opens the window for the current page, so a project page
 * lands on that project inside the Projects window.
 */
export function DesktopLink({ onClick, ...props }: DesktopLinkProps) {
	const pathname = usePathname();

	return (
		<Link
			href={desktopHref(pathname)}
			onClick={(event) => {
				rememberUiMode("desktop");
				onClick?.(event);
			}}
			{...props}
		/>
	);
}
