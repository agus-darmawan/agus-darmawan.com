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
	// Required by the Dockerfile (it copies .next/standalone). Harmless on Vercel.
	output: "standalone",
	// The content layer reads /content with fs at request time (ISR) — make
	// sure those files ship with the serverless/standalone bundle.
	outputFileTracingIncludes: {
		"/**": ["./content/projects/**/*", "./content/blog/**/*"],
	},
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "i.scdn.co" },
			{ protocol: "https", hostname: "img.youtube.com" },
			{ protocol: "https", hostname: "agus-darmawan.com" },
			{ protocol: "https", hostname: "www.agus-darmawan.com" },
			{ protocol: "https", hostname: "content.agus-darmawan.com" },
		],
	},
	// Baseline hardening; no CSP yet (inline styles/Turnstile/Sentry need a
	// nonce setup first).
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "X-Frame-Options", value: "SAMEORIGIN" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{
						key: "Permissions-Policy",
						value:
							"camera=(), microphone=(), geolocation=(), browsing-topics=()",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains",
					},
				],
			},
		];
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
