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
	title: {
		default: "Agus Darmawan — Portfolio",
		template: "%s · Agus Darmawan",
	},
	description:
		"Full-Stack & Robotics Developer. Building web apps and autonomous robots from Bali, Indonesia.",
	keywords: [
		"portfolio",
		"ubuntu",
		"developer",
		"web development",
		"react",
		"next.js",
		"robotics",
		"ROS",
		"full-stack",
		"Bali",
		"Indonesia",
	],
	authors: [
		{ name: "I Wayan Agus Darmawan", url: "https://agus-darmawan.com" },
	],
	creator: "agus-darmawan",
	metadataBase: new URL("https://agus-darmawan.com"),
	openGraph: {
		title: "Agus Darmawan — Full-Stack & Robotics Developer",
		description:
			"Interactive Ubuntu 22.04 themed portfolio. Full-Stack & Robotics Developer from Bali.",
		url: "https://agus-darmawan.com",
		siteName: "Agus Darmawan Portfolio",
		type: "website",
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "Agus Darmawan — Full-Stack & Robotics Developer",
		description:
			"Interactive Ubuntu 22.04 themed portfolio. Full-Stack & Robotics Developer from Bali.",
		creator: "@agusdarmawnn",
	},
	robots: {
		index: true,
		follow: true,
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
