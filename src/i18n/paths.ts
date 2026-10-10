/**
 * `/en/blog/x` style path (client- and server-safe).
 * `path` is locale-less and starts with "/" — "" or "/" mean the home page.
 */
export const localizedPath = (locale: string, path = "") =>
	`/${locale}${path === "/" ? "" : path}`;
