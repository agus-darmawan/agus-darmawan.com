import { ChevronDown } from "lucide-react";

/**
 * MenuTrigger — chevron button that opens/closes the settings panel.
 */
export function MenuTrigger({
	open,
	onToggle,
}: {
	open: boolean;
	onToggle: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onToggle}
			aria-haspopup="true"
			aria-label="Open settings menu"
			className="p-1.5 rounded-md transition-colors"
			style={{ color: "var(--topbar-text)" }}
			onMouseEnter={(e) => {
				(e.currentTarget as HTMLElement).style.background =
					"var(--topbar-hover)";
			}}
			onMouseLeave={(e) => {
				(e.currentTarget as HTMLElement).style.background = "transparent";
			}}
		>
			<ChevronDown
				className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
			/>
		</button>
	);
}
