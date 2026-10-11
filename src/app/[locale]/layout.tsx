import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { hasLocale } from "next-intl";
import {
	getMessages,
	getTranslations,
	setRequestLocale,
} from "next-intl/server";
import { SITE } from "@/config/site";
import { routing } from "@/i18n/routing";
import { alternates } from "@/lib/seo/metadata";
import { Providers } from "./providers";

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

// Ubuntu Light (300) is the display voice of the classic site; Ubuntu Mono
// is what the real terminal uses, so the desktop terminal and code blocks get it.
const ubuntu = Ubuntu({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-ubuntu",
});

const ubuntuMono = Ubuntu_Mono({
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-ubuntu-mono",
});

// Prerender /en and /id at build time instead of rendering per request.
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
	themeColor: "#2c001e",
	colorScheme: "dark light",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Seo" });

	return {
		metadataBase: new URL(SITE.url),
		title: {
			// The query people type is "agus darmawan" — lead with it.
			default: t("homeTitle"),
			template: `%s · ${SITE.shortName}`,
		},
		description: t("homeDescription"),
		applicationName: SITE.shortName,
		authors: [{ name: SITE.name, url: SITE.url }],
		creator: SITE.name,
		publisher: SITE.name,
		alternates: alternates(locale),
		openGraph: {
			title: t("homeTitle"),
			description: t("homeDescription"),
			url: `${SITE.url}/${locale}`,
			siteName: SITE.shortName,
			type: "profile",
			firstName: "Agus",
			lastName: "Darmawan",
			username: SITE.github.username,
			locale: locale === "id" ? "id_ID" : "en_US",
			alternateLocale: locale === "id" ? ["en_US"] : ["id_ID"],
		},
		twitter: {
			card: "summary_large_image",
			title: t("homeTitle"),
			description: t("homeDescription"),
			creator: SITE.twitterHandle,
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		verification: {
			// Set in Vercel → Search Console "HTML tag" method.
			google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
		},
	};
}

export default async function LocaleLayout({ children, params }: Props) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	setRequestLocale(locale);

	const messages = await getMessages();
	const beaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

	return (
		<html
			lang={locale}
			suppressHydrationWarning
			className={`${ubuntu.variable} ${ubuntuMono.variable}`}
		>
			<body className="antialiased">
				<Providers locale={locale} messages={messages}>
					{children}
				</Providers>
				{/* Cloudflare Web Analytics: cookie-less, and the source of the
				    terminal's `uptime` visitor count. */}
				{beaconToken && (
					<Script
						src="https://static.cloudflareinsights.com/beacon.min.js"
						data-cf-beacon={JSON.stringify({ token: beaconToken })}
						strategy="afterInteractive"
					/>
				)}
			</body>
		</html>
	);
}
