import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

export default function IndexPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = use(params);

	setRequestLocale(locale);

	// Once the request locale is set, you
	// can call hooks from `next-intl`
	const t = useTranslations("HomePage");

	return (
		<main>
			<h1>{t("title")}</h1>
		</main>
	);
}
