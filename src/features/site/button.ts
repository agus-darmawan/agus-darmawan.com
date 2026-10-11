import { cn } from "@/lib/utils";

const BASE =
	"inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-[0.95rem] font-medium whitespace-nowrap transition-[background-color,border-color,color,opacity] duration-150";

const VARIANTS = {
	/** Inverted ink: aubergine on light, pale on dark. */
	primary: "bg-(--site-primary) text-(--site-on-primary) hover:opacity-90",
	secondary:
		"border border-(--site-line) text-(--site-ink) hover:border-(--site-ink)",
	/** Ubuntu orange with aubergine text (passes contrast in both themes). */
	launch: "bg-ubuntu-orange text-[#2c001e] hover:bg-[#f26a3c]",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

/** Class names for links and buttons styled as site buttons. */
export const buttonClass = (
	variant: ButtonVariant = "primary",
	className?: string,
) => cn(BASE, VARIANTS[variant], className);

/** Inline text link in the site's link colour. */
export const textLinkClass =
	"font-medium text-(--site-link) underline-offset-4 hover:underline";
