"use client";

import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

type DesktopLinkProps = Omit<ComponentProps<typeof Link>, "href">;

/** Every way into the interactive desktop goes through this link. */
export function DesktopLink(props: DesktopLinkProps) {
	return <Link href="/" {...props} />;
}
