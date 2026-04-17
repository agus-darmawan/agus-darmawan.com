import type { Metadata } from "next";
import "@/styles/globals.css";
import { Ubuntu } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Providers } from "./providers";

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

const ubuntu = Ubuntu({
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const isId = locale === "id";

	return {
		title: {
			default: "Agus Darmawan — Full-Stack & Robotics Developer",
			template: "%s · Agus Darmawan",
		},
		description: isId
			? "Lulusan Teknik Komputer ITS 2025. Full-stack web developer dan robotics engineer dari Bali. Pengalaman 20+ freelance project, ROS2, Next.js, dan robot inspeksi quadruped."
			: "Computer Engineering graduate ITS 2025. Full-stack web developer and robotics engineer from Bali, Indonesia. 20+ freelance projects, ROS2, Next.js, autonomous robots.",
		keywords: isId
			? [
					"developer robotika indonesia",
					"full stack developer bali",
					"ROS2 developer indonesia",
					"web developer surabaya bali",
					"robot inspeksi quadruped",
					"next.js developer indonesia",
					"agus darmawan",
					"ITS surabaya teknik komputer",
					"freelance developer bali",
					"robotics software engineer",
				]
			: [
					"robotics software engineer Indonesia",
					"full stack developer Bali Indonesia",
					"ROS2 developer",
					"Next.js developer Indonesia",
					"quadruped inspection robot",
					"autonomous robot developer",
					"agus darmawan portfolio",
					"ITS Surabaya computer engineering",
					"freelance developer Bali",
					"web and robotics developer",
				],
		authors: [
			{ name: "I Wayan Agus Darmawan", url: "https://agus-darmawan.com" },
		],
		creator: "I Wayan Agus Darmawan",
		metadataBase: new URL("https://agus-darmawan.com"),
		manifest: "/manifest.json",
		// ✅ hreflang — Google tahu ada versi EN dan ID
		alternates: {
			canonical: `https://agus-darmawan.com/${locale}`,
			languages: {
				en: "https://agus-darmawan.com/en",
				id: "https://agus-darmawan.com/id",
				"x-default": "https://agus-darmawan.com/en",
			},
		},
		openGraph: {
			title: "Agus Darmawan — Full-Stack & Robotics Developer",
			description:
				"Interactive Ubuntu 22.04 themed portfolio. Full-Stack & Robotics Developer from Bali, Indonesia.",
			url: `https://agus-darmawan.com/${locale}`,
			siteName: "Agus Darmawan Portfolio",
			type: "website",
			locale: isId ? "id_ID" : "en_US",
			alternateLocale: isId ? ["en_US"] : ["id_ID"],
			images: [
				{
					url: "https://agus-darmawan.com/opengraph-image",
					width: 1200,
					height: 630,
					alt: "Agus Darmawan — Full-Stack & Robotics Developer",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: "Agus Darmawan — Full-Stack & Robotics Developer",
			description:
				"Full-Stack & Robotics Developer from Bali. Interactive Ubuntu-themed portfolio.",
			creator: "@agusdarmawnn",
			images: ["https://agus-darmawan.com/opengraph-image"],
		},
		robots: { index: true, follow: true },
	};
}

export default async function LocaleLayout({ children, params }: Props) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	setRequestLocale(locale);

	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={`${ubuntu.className} antialiased`}>
				<Providers locale={locale} messages={messages}>
					{children}
				</Providers>
			</body>
		</html>
	);
}
