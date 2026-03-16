"use client";

import type { TermLine } from "./types/terminal.types";

interface TerminalOutputProps {
	lines: TermLine[];
}

const lineColor: Record<TermLine["type"], string> = {
	error: "text-red-400",
	system: "text-zinc-500",
	input: "text-green-400",
	output: "text-zinc-200",
};

export function TerminalOutput({ lines }: TerminalOutputProps) {
	return (
		<>
			{lines.map((line) => (
				<div
					key={line.id}
					className={`whitespace-pre-wrap break-all leading-5 text-xs font-mono ${lineColor[line.type]}`}
				>
					{line.text}
				</div>
			))}
		</>
	);
}
