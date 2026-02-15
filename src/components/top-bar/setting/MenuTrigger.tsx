import { ChevronDown } from "lucide-react";

/**
 * MenuTrigger — button that toggles the settings menu, showing a
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
			onClick={onToggle}
			type="button"
			aria-haspopup="true"
			aria-label="Open settings menu"
			className="p-1 rounded-md hover:bg-white/10 transition-colors"
		>
			<ChevronDown
				className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
			/>
		</button>
	);
}
