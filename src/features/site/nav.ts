/** Top-level pages of the classic site, in navigation order. */
export const SITE_NAV = [
	{ href: "/about", key: "about" },
	{ href: "/projects", key: "projects" },
	{ href: "/blog", key: "blog" },
] as const;

/** `/projects` is active on `/projects` and on `/projects/some-slug`. */
export const isActivePath = (pathname: string, href: string) =>
	pathname === href || pathname.startsWith(`${href}/`);
