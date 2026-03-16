import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	environment: process.env.NODE_ENV,

	// Only capture errors in production — no noise during development
	enabled: process.env.NODE_ENV === "production",

	// Sample 10% of transactions — sufficient for a portfolio
	tracesSampleRate: 0.1,

	// Sample 10% of sessions, 100% when an error occurs
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,

	integrations: [
		Sentry.replayIntegration({
			// Mask all inputs — prevents contact form data being recorded
			maskAllInputs: true,
			blockAllMedia: false,
		}),
	],
});

// Required for Sentry to instrument Next.js navigation transitions
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
