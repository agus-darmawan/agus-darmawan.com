"use client";
import { useState } from "react";
import { Dock } from "@/components/dock/Dock";
import TopBar from "@/components/top-bar/TopBar";
// import { useTranslations } from "next-intl";
// import { setRequestLocale } from "next-intl/server";
// import { use } from "react";
import { WindowState } from "@/types/app";

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
	const [activeWindow, setActiveWindow] = useState<string | null>(null);
	const [windows, _] = useState<WindowState[]>([]);

	const handleIconClick = (windowId: string) => {
		setActiveWindow(windowId);
	};

	return (
		<main className="w-full h-screen bg-ubuntu-purple overflow-hidden select-none">
			<TopBar />
			<Dock
				windows={windows}
				activeWindow={activeWindow}
				onIconClick={handleIconClick}
			/>
		</main>
	);
}
