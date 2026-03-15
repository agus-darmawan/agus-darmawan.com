"use client";

import type { TermLine } from "@/types/terminal";

interface TerminalOutputProps {
	lines: TermLine[];
}

const lineColor: Record<TermLine["type"], string> = {
	error: "#ff5555",
	system: "#666",
	input: "#50fa7b",
	output: "#c8c8c8",
};

export function TerminalOutput({ lines }: TerminalOutputProps) {
	return (
		<>
			{lines.map((line) => (
				<div
					key={line.id}
					className="whitespace-pre-wrap leading-5 break-all"
					style={{ color: lineColor[line.type], fontSize: "0.8rem" }}
				>
					{line.text}
				</div>
			))}
		</>
	);
}
