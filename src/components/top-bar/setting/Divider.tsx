/**
 * Divider — thin separator line for settings panel sections.
 */
export function Divider() {
	return (
		<div
			className="h-px my-1"
			style={{ background: "var(--panel-border)" }}
			aria-hidden
		/>
	);
}
