"use client";

interface TerminalHintsBarProps {
	hints: { key: string; desc: string }[];
}

export function TerminalHintsBar({ hints }: TerminalHintsBarProps) {
	return (
		<div
			className="px-3 py-1 text-xs shrink-0 flex gap-4 border-t font-mono"
			style={{
				background: "#010409",
				borderColor: "#30363d",
				color: "#484f58",
			}}
		>
			<span>
				{hints.map(({ key, desc }, i) => (
					<span key={i}>
						<span style={{ color: "#79c0ff" }}>{key}</span>
						<span style={{ color: "#484f58" }}>{desc}</span>
						{i < hints.length - 1 ? "  " : ""}
					</span>
				))}
			</span>
		</div>
	);
}
