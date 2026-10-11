import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { UI_MODE_COOKIE } from "./lib/ui-mode";

const intl = createMiddleware(routing);

export default function proxy(request: NextRequest) {
	const response = intl(request);

	// The bare domain reopens the view the visitor chose last. Only "/":
	// explicit URLs always render what they name, and crawlers (no cookie)
	// always get the website.
	if (
		request.nextUrl.pathname === "/" &&
		request.cookies.get(UI_MODE_COOKIE)?.value === "desktop"
	) {
		const location = response.headers.get("location");
		if (location) {
			const target = new URL(location, request.url);
			target.pathname = `${target.pathname.replace(/\/$/, "")}/desktop`;
			response.headers.set("location", target.toString());
		}
	}

	return response;
}

export const config = {
	// Skip API routes, Next internals, files with an extension, and
	// `/monitoring` — the Sentry tunnel (tunnelRoute in next.config.ts).
	// Without that exclusion every Sentry envelope was redirected to
	// /en/monitoring and answered 404.
	matcher: ["/((?!api|monitoring|_next|_vercel|.*\\..*).*)"],
};
