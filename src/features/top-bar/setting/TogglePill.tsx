import { cn } from "@/lib/utils";

/** Visual on/off indicator; the surrounding MenuItem carries the semantics. */
export function TogglePill({ active }: { active: boolean }) {
	return (
		<span
			aria-hidden
			className={cn(
				"relative block w-10 h-5 shrink-0 rounded-full transition-colors duration-200",
				active ? "bg-ubuntu-orange" : "bg-white/20",
			)}
		>
			{/* Explicit `left`: an absolute box without one sits at its static
			    position, which pushed the knob past the right edge. */}
			<span
				className={cn(
					"absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform duration-200",
					active ? "translate-x-5" : "translate-x-0",
				)}
			/>
		</span>
	);
}
