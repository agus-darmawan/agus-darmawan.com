import type { ButtonHTMLAttributes } from "react";

/** A full-width row button inside the system menu. */
export function MenuItem(props: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			type="button"
			{...props}
			className="w-full flex items-center justify-between px-4 py-2.5 transition-colors text-(--panel-text) hover:bg-(--panel-hover) focus-visible:bg-(--panel-hover) outline-none"
		/>
	);
}
