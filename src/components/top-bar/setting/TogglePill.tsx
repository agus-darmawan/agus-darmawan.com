/*
 * A simple toggle pill component that can be used in the settings menu.
 */

export function TogglePill({ active }: { active: boolean }) {
	return (
		<div
			className={`w-10 h-5 rounded-full transition-colors ${
				active ? "bg-blue-500" : "bg-gray-600"
			}`}
		>
			<div
				className={`w-4 h-4 bg-white rounded-full shadow mt-0.5 transition-transform ${
					active ? "translate-x-5" : "translate-x-0.5"
				}`}
			/>
		</div>
	);
}
