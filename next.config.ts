import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.scdn.co",
			},
			{
				protocol: "https",
				hostname: "img.youtube.com",
			},
			{
				protocol: "https",
				hostname: "agus-darmawan.com",
			},
			{
				protocol: "https",
				hostname: "www.agus-darmawan.com",
			},
		],
	},
};

const withNextIntl = createNextIntlPlugin();

export default withSentryConfig(withNextIntl(nextConfig), {
	org: "nematodev",
	project: "agus-darmawan",

	// Only print logs when uploading source maps in CI
	silent: !process.env.CI,

	// Upload larger set of source maps for prettier stack traces
	widenClientFileUpload: true,

	// Route browser requests through Next.js to avoid ad-blockers
	tunnelRoute: "/monitoring",

	// Remove source maps from production build after upload
	// Prevents source code exposure in browser devtools
	sourcemaps: {
		deleteSourcemapsAfterUpload: true,
	},

	// Tree-shake Sentry logger from client bundle
	// Note: not supported with Turbopack, only applies to webpack builds
	webpack: {
		treeshake: {
			removeDebugLogging: true,
		},
	},
});
