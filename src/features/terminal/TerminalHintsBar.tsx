interface TerminalHintsBarProps {
	hints: { key: string; desc: string }[];
	className?: string;
}

export function TerminalHintsBar({
	hints,
	className = "",
}: TerminalHintsBarProps) {
	return (
		<p
			className={`px-3 py-1 text-xs shrink-0 flex flex-wrap gap-x-4 border-t font-mono bg-[#010409] border-[#30363d] text-[#484f58] ${className}`}
		>
			{hints.map(({ key, desc }) => (
				<span key={key}>
					<kbd className="text-[#79c0ff] font-mono">{key}</kbd>
					{desc}
				</span>
			))}
		</p>
	);
}
