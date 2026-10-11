import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/config/site";
import { ContactForm } from "@/features/contact/ContactForm";
import { Container } from "@/features/site/Container";
import { ContactChannels } from "@/features/site/contact/ContactChannels";
import { PageHeader } from "@/features/site/PageHeader";
import { SiteShell } from "@/features/site/SiteShell";
import { pageJsonLd, toJsonLdCrumbs } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

const PATH = "/contact";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Seo" });
	return pageMetadata({
		locale,
		path: PATH,
		title: t("contactTitle"),
		description: t("contactDescription"),
	});
}

export default async function ContactPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	const [t, site, contact] = await Promise.all([
		getTranslations({ locale, namespace: "Seo" }),
		getTranslations({ locale, namespace: "Site" }),
		getTranslations({ locale, namespace: "ContactWindow" }),
	]);
	const crumbs = [
		{ name: SITE.shortName, href: "/" },
		{ name: t("contactTitle"), href: PATH },
	];

	return (
		<SiteShell>
			<JsonLd
				data={pageJsonLd({
					locale,
					path: PATH,
					name: t("contactTitle"),
					type: "ContactPage",
					breadcrumbs: toJsonLdCrumbs(locale, crumbs),
				})}
			/>
			<Container className="pb-24">
				<PageHeader title={t("contactTitle")} lede={contact("headerDesc")} />
				<div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
					<section aria-labelledby="direct">
						<h2
							id="direct"
							className="mb-5 text-xl font-medium text-(--site-ink)"
						>
							{site("contact.direct")}
						</h2>
						<ContactChannels />
					</section>
					<section
						aria-labelledby="message"
						className="rounded-2xl border border-(--site-line) bg-(--site-raised)/60 p-5 sm:p-8"
					>
						<h2 id="message" className="text-xl font-medium text-(--site-ink)">
							{site("contact.formTitle")}
						</h2>
						<p className="mb-6 mt-1.5 text-(--site-muted)">
							{site("contact.formNote")}
						</p>
						<ContactForm variant="page" />
					</section>
				</div>
			</Container>
		</SiteShell>
	);
}
