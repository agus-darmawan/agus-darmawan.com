"use client";
// import { useTranslations } from "next-intl";
// import { setRequestLocale } from "next-intl/server";
// import { use } from "react";
import TopBar from "@/components/top-bar/TopBar";

export default function IndexPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	// const { locale } = use(params);

	// setRequestLocale(locale);

	// Once the request locale is set, you
	// can call hooks from `next-intl`
	// const t = useTranslations("HomePage");

	return (
		<main className="w-full h-screen bg-ubuntu-purple overflow-hidden select-none">
			<TopBar />
		</main>
	);
}
