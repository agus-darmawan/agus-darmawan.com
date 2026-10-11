"use client";

import { Grip } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { DockTooltip } from "./DockIcon";

interface DockLauncherProps {
	isOpen: boolean;
	onClick: () => void;
}

/** The Ubuntu-style "show applications" button at the start of the dock. */
export function DockLauncher({ isOpen, onClick }: DockLauncherProps) {
	const t = useTranslations("Dock");
	const label = isOpen ? t("launcherClose") : t("launcherOpen");

	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			aria-expanded={isOpen}
			aria-haspopup="dialog"
			className={cn(
				"group relative w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70",
				isOpen ? "bg-ubuntu-orange" : "bg-white/8 hover:bg-white/15",
			)}
		>
			<Grip size={30} className="text-white/75" aria-hidden />
			<DockTooltip>{label}</DockTooltip>
		</button>
	);
}
