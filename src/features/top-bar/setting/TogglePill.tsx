import { cn } from "@/lib/utils";

/** Visual on/off indicator; the surrounding MenuItem carries the semantics. */
export function TogglePill({ active }: { active: boolean }) {
	return (
		<span
			aria-hidden
			className={cn(
				"relative w-10 h-5 rounded-full transition-colors duration-200",
				active ? "bg-ubuntu-orange" : "bg-white/20",
			)}
		>
			<span
				className={cn(
					"absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200",
					active ? "translate-x-5" : "translate-x-0.5",
				)}
			/>
		</span>
	);
}
