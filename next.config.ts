import withBundleAnalyzerPkg from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const withBundleAnalyzer = withBundleAnalyzerPkg({
	enabled: process.env.ANALYZE === "true",
	openAnalyzer: true,
});

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "i.scdn.co" },
			{ protocol: "https", hostname: "img.youtube.com" },
			{ protocol: "https", hostname: "agus-darmawan.com" },
			{ protocol: "https", hostname: "www.agus-darmawan.com" },
			{ protocol: "https", hostname: "content.agus-darmawan.com" },
		],
	},
	experimental: {
		optimizePackageImports: ["lucide-react", "framer-motion", "@sentry/nextjs"],
	},
};

const analyzed = withBundleAnalyzer(withNextIntl(nextConfig));

export default withSentryConfig(analyzed, {
	org: "nematodev",
	project: "agus-darmawan",
	silent: !process.env.CI,
	widenClientFileUpload: true,
	tunnelRoute: "/monitoring",
	sourcemaps: {
		deleteSourcemapsAfterUpload: true,
	},
	webpack: {
		treeshake: {
			removeDebugLogging: true,
		},
	},
});
