/**
 * TogglePill — visual on/off indicator (not interactive on its own).
 */
export function TogglePill({ active }: { active: boolean }) {
	return (
		<div
			className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
				active ? "bg-ubuntu-orange" : "bg-white/20"
			}`}
			role="presentation"
		>
			<div
				className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
					active ? "translate-x-5" : "translate-x-0.5"
				}`}
			/>
		</div>
	);
}
