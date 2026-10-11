/**
 * The website's type scale. Ubuntu runs large (a 15px body reads like 16px
 * in most faces), so sizes stay modest; display sizes use Ubuntu Light.
 */

/** The name on the home page. */
export const HERO_HEADING =
	"text-[clamp(2.25rem,4vw,3rem)] font-light leading-[1.05] tracking-[-0.025em] text-(--site-ink)";

/** Page titles (h1). */
export const DISPLAY_HEADING =
	"text-[clamp(1.875rem,3.2vw,2.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-(--site-ink)";

/** Section titles (h2). */
export const SECTION_HEADING =
	"text-[1.375rem] font-light leading-tight tracking-[-0.01em] text-(--site-ink) sm:text-[1.5rem]";

/** Intro paragraph under a title. */
export const LEDE = "text-[1.0625rem] leading-relaxed text-(--site-muted)";

/** Titles of rows in lists: projects, posts, roles, schools. */
export const ITEM_TITLE =
	"text-[1.0625rem] font-medium leading-snug text-(--site-ink)";
