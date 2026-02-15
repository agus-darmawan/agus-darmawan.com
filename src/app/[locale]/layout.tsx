import type { Metadata } from "next";
import "@/styles/globals.css";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Providers } from "@/components/providers/Providers";
import { routing } from "@/i18n/routing";

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
	title: "Ubuntu Portfolio - Your Name",
	description:
		"Interactive Ubuntu 22.04 themed portfolio showcasing my work and experience",
	keywords: [
		"portfolio",
		"ubuntu",
		"developer",
		"web development",
		"react",
		"next.js",
	],
	authors: [{ name: "I Wayan Agus Darmawan" }],
	creator: "agus-darmawan",
	openGraph: {
		title: "Dar Portfolio - Agus Darmawan",
		description: "Interactive Ubuntu 22.04 themed portfolio",
		type: "website",
	},
};

export default async function LocaleLayout({ children, params }: Props) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
			</head>
			<body className="antialiased">
				<NextIntlClientProvider>
					<Providers>{children}</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
