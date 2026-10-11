import { type AppId, isAppId } from "@/config/apps";

/**
 * The two views show the same things, so every website page has a desktop
 * equivalent and back: /projects/foo ⇄ /desktop?open=projects&item=foo.
 * Paths here are locale-less, like next-intl's `usePathname`.
 */

/** Apps with a website page of the same name (/about, /projects, …). */
const PAGE_APPS: readonly AppId[] = [
	"about",
	"experience",
	"projects",
	"blog",
	"contact",
];

/** Apps whose window can show a single item: a project, a post. */
const ITEM_APPS: readonly AppId[] = ["projects", "blog"];

/** Apps without a page: the CV download sits on the profile page. */
const FALLBACK_PAGES: Partial<Record<AppId, string>> = { resume: "/about" };

// Content slugs are file names or lower-cased GitHub repo names.
const SLUG = /^[a-z0-9][\w.-]*$/i;

const hasPage = (app: string): app is AppId =>
	(PAGE_APPS as readonly string[]).includes(app);
const showsItems = (app: AppId) => ITEM_APPS.includes(app);

export interface DeepLink {
	app: AppId;
	item?: string;
}

export interface DesktopHref {
	pathname: "/desktop";
	query?: { open: AppId; item?: string };
}

/** Where the desktop shows what a website page shows. */
export function desktopHref(pathname: string): DesktopHref {
	const [, section = "", slug] = pathname.split("/");
	if (!hasPage(section)) return { pathname: "/desktop" };
	return {
		pathname: "/desktop",
		query:
			slug && showsItems(section) && SLUG.test(slug)
				? { open: section, item: slug }
				: { open: section },
	};
}

/** Read `?open=<app>&item=<slug>`. Unknown apps and odd slugs are ignored. */
export function parseDeepLink(search: string): DeepLink | null {
	const params = new URLSearchParams(search);
	const app = params.get("open");
	if (!app || !isAppId(app)) return null;
	const item = params.get("item");
	return item && showsItems(app) && SLUG.test(item) ? { app, item } : { app };
}

/** The website page for a desktop window (and the item it shows, if any). */
export function websitePath(app?: AppId | null, item?: string | null) {
	if (!app) return "/";
	if (item && showsItems(app) && SLUG.test(item)) return `/${app}/${item}`;
	if (hasPage(app)) return `/${app}`;
	return FALLBACK_PAGES[app] ?? "/";
}
