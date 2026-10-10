import { memo } from "react";
import type { LineKind, TermLine } from "./lib/types";

const COLOR: Record<LineKind, string> = {
	error: "text-[#f85149]",
	system: "text-[#484f58]",
	input: "text-[#4ec9b0]",
	output: "text-[#cdd9e5]",
};

export const TerminalOutput = memo(function TerminalOutput({
	lines,
}: {
	lines: TermLine[];
}) {
	return lines.map((line) => (
		<div
			key={line.id}
			className={`whitespace-pre-wrap break-all leading-5 ${COLOR[line.kind]}`}
		>
			{line.text}
		</div>
	));
});
