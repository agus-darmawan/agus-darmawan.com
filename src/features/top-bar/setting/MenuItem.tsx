/**
 * MenuItem — a button row inside the settings / panel dropdown.
 */
export function MenuItem({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="w-full flex items-center justify-between px-4 py-2.5 transition-colors"
			style={{
				color: "var(--panel-text)",
			}}
			onMouseEnter={(e) => {
				(e.currentTarget as HTMLElement).style.background =
					"var(--panel-hover)";
			}}
			onMouseLeave={(e) => {
				(e.currentTarget as HTMLElement).style.background = "transparent";
			}}
		>
			{children}
		</button>
	);
}
