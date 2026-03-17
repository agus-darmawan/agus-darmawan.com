"use client";

import type { TermLine } from "./types/terminal.types";

interface TerminalOutputProps {
	lines: TermLine[];
}

const lineStyle: Record<TermLine["type"], React.CSSProperties> = {
	error: { color: "#f85149" },
	system: { color: "#484f58" },
	input: { color: "#4ec9b0" },
	output: { color: "#cdd9e5" },
};

export function TerminalOutput({ lines }: TerminalOutputProps) {
	return (
		<>
			{lines.map((line) => (
				<div
					key={line.id}
					className="whitespace-pre-wrap break-all leading-5 text-xs font-mono"
					style={lineStyle[line.type]}
				>
					{line.text}
				</div>
			))}
		</>
	);
}
