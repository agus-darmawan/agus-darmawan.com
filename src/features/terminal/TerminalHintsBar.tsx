"use client";

interface TerminalHintsBarProps {
	hints: { key: string; desc: string }[];
}

export function TerminalHintsBar({ hints }: TerminalHintsBarProps) {
	return (
		<div className="px-3 py-1 text-xs shrink-0 flex gap-4 border-t border-zinc-800 text-zinc-500 bg-zinc-950 font-mono">
			<span>
				{hints.map(({ key, desc }, i) => (
					<span key={i}>
						<span className="text-cyan-300">{key}</span>
						{desc}
						{i < hints.length - 1 ? " " : ""}
					</span>
				))}
			</span>
		</div>
	);
}
