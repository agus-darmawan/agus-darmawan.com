import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
	// Skip API routes, Next internals, files with an extension, and
	// `/monitoring` — the Sentry tunnel (tunnelRoute in next.config.ts).
	// Without that exclusion every Sentry envelope was redirected to
	// /en/monitoring and answered 404.
	matcher: ["/((?!api|monitoring|_next|_vercel|.*\\..*).*)"],
};
