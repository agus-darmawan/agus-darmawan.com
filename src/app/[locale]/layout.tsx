import type { Metadata } from "next";
import "@/styles/globals.css";
import { Ubuntu } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { Providers } from "./providers";

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

const ubuntu = Ubuntu({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Darmawan Portfolio",
	description: "Interactive Ubuntu 22.04 themed portfolio",
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
		title: "Ubuntu Portfolio - Agus Darmawan",
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
			<body className={`${ubuntu.className} antialiased`}>
				<NextIntlClientProvider>
					<Providers>{children}</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
