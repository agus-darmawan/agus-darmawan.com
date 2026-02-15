/**
 * MenuItem component represents an individual item in a settings menu. It is a button that triggers a specified action when clicked.
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
			onClick={onClick}
			type="button"
			className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors"
		>
			{children}
		</button>
	);
}
