import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuTriggerProps {
	open: boolean;
	controls: string;
	label: string;
	onToggle: () => void;
}

/** Chevron button that opens/closes the system menu. */
export function MenuTrigger({
	open,
	controls,
	label,
	onToggle,
}: MenuTriggerProps) {
	return (
		<button
			type="button"
			onClick={onToggle}
			aria-haspopup="dialog"
			aria-expanded={open}
			aria-controls={open ? controls : undefined}
			aria-label={label}
			className="p-1.5 rounded-md transition-colors text-(--topbar-text) hover:bg-(--topbar-hover)"
		>
			<ChevronDown
				aria-hidden
				className={cn(
					"w-4 h-4 transition-transform duration-200",
					open && "rotate-180",
				)}
			/>
		</button>
	);
}
