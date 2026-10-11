"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { LocaleSwitch } from "./LocaleSwitch";
import { isActivePath, SITE_NAV } from "./nav";
import { OpenDesktopLink } from "./OpenDesktopLink";
import { SiteLogo } from "./SiteLogo";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
	const t = useTranslations("Site");
	const pathname = usePathname();
	// The menu belongs to the page it was opened on: navigating closes it.
	const [menuFor, setMenuFor] = useState<string | null>(null);
	const open = menuFor === pathname;
	const toggleRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key !== "Escape") return;
			setMenuFor(null);
			// Focus was probably inside the menu that just disappeared.
			toggleRef.current?.focus();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	const links = SITE_NAV.map(({ href, key }) => ({
		href,
		label: t(`nav.${key}`),
		active: isActivePath(pathname, href),
	}));

	return (
		<header className="sticky top-0 z-40 border-b border-(--site-line) bg-(--site-bg)/85 backdrop-blur-md">
			<Container className="flex h-16 items-center gap-8">
				<SiteLogo />

				<nav aria-label={t("primaryNav")} className="hidden lg:block">
					<ul className="flex items-center gap-1">
						{links.map(({ href, label, active }) => (
							<li key={href}>
								<Link
									href={href}
									aria-current={active ? "page" : undefined}
									className={cn(
										"rounded-md px-3 py-2 text-[0.95rem] transition-colors",
										active
											? "text-(--site-ink) underline decoration-ubuntu-orange decoration-2 underline-offset-8"
											: "text-(--site-muted) hover:text-(--site-ink)",
									)}
								>
									{label}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<div className="ml-auto flex items-center gap-1 sm:gap-2">
					<LocaleSwitch className="max-sm:hidden" />
					<ThemeToggle className="max-sm:hidden" />
					<OpenDesktopLink compact />
					<button
						ref={toggleRef}
						type="button"
						onClick={() => setMenuFor(open ? null : pathname)}
						aria-expanded={open}
						aria-controls="site-menu"
						aria-label={open ? t("closeMenu") : t("menu")}
						className="inline-flex size-9 items-center justify-center rounded-lg text-(--site-ink) hover:bg-(--site-raised) lg:hidden"
					>
						{open ? (
							<X className="size-5" aria-hidden />
						) : (
							<Menu className="size-5" aria-hidden />
						)}
					</button>
				</div>
			</Container>

			{open && (
				<div
					id="site-menu"
					className="border-t border-(--site-line) bg-(--site-bg) lg:hidden"
				>
					<Container className="pb-6 pt-2">
						<nav aria-label={t("primaryNav")}>
							<ul>
								{links.map(({ href, label, active }) => (
									<li key={href} className="border-b border-(--site-line)">
										<Link
											href={href}
											aria-current={active ? "page" : undefined}
											className={cn(
												"block py-3.5 text-lg",
												active
													? "font-medium text-(--site-ink)"
													: "text-(--site-text)",
											)}
										>
											{label}
										</Link>
									</li>
								))}
							</ul>
						</nav>
						<div className="mt-4 flex items-center justify-between">
							<LocaleSwitch />
							<ThemeToggle withLabel />
						</div>
					</Container>
				</div>
			)}
		</header>
	);
}
