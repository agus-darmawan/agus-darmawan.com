"use client";

interface TerminalHintsBarProps {
	hints: { key: string; desc: string }[];
}

export function TerminalHintsBar({ hints }: TerminalHintsBarProps) {
	return (
		<div
			className="px-3 py-1 text-xs shrink-0 flex gap-4"
			style={{
				borderTop: "1px solid #1e1e1e",
				color: "#444",
				background: "#080808",
			}}
		>
			<span>
				{hints.map(({ key, desc }, i) => (
					<span key={i}>
						<span style={{ color: "#8be9fd" }}>{key}</span>
						{desc}
						{i < hints.length - 1 ? " " : ""}
					</span>
				))}
			</span>
		</div>
	);
}
