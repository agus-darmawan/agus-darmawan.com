"use client";

import { type RefObject, useCallback } from "react";
import type { FSNode } from "@/types/terminal";

interface TerminalInputLineProps {
	inputRef: RefObject<HTMLInputElement | null>;
	input: string;
	cwd: string;
	history: string[];
	fs: FSNode;
	placeholder: string;
	onChange: (val: string) => void;
	onSubmit: (val: string) => void;
	onHistoryUp: () => void;
	onHistoryDown: () => void;
	onClear: () => void;
	onAddLines: (text: string) => void;
}

export function TerminalInputLine({
	inputRef,
	input,
	cwd,
	history,
	fs,
	placeholder,
	onChange,
	onSubmit,
	onHistoryUp,
	onHistoryDown,
	onClear,
	onAddLines,
}: TerminalInputLineProps) {
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				onSubmit(input);
				onChange("");
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				onHistoryUp();
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				onHistoryDown();
			} else if (e.key === "Tab") {
				e.preventDefault();
				const partial = input.split(" ").pop() ?? "";
				const dir = fs[cwd] ?? {};
				const matches = Object.keys(dir).filter((k) => k.startsWith(partial));
				if (matches.length === 1) {
					const parts = input.split(" ");
					parts[parts.length - 1] = matches[0];
					onChange(parts.join(" "));
				} else if (matches.length > 1) {
					onAddLines(matches.join("  "));
				}
			} else if (e.key === "l" && e.ctrlKey) {
				e.preventDefault();
				onClear();
			} else if (e.key === "c" && e.ctrlKey) {
				e.preventDefault();
				onAddLines(`darm@wan:${cwd}$ ${input}^C`);
				onChange("");
			}
		},
		[
			input,
			cwd,
			fs,
			onSubmit,
			onChange,
			onHistoryUp,
			onHistoryDown,
			onClear,
			onAddLines,
		],
	);

	return (
		<div className="flex items-center" style={{ lineHeight: "1.4" }}>
			<span style={{ color: "#50fa7b", fontSize: "0.8rem" }}>darm@wan:</span>
			<span style={{ color: "#8be9fd", fontSize: "0.8rem" }}>{cwd}</span>
			<span style={{ color: "#c8c8c8", fontSize: "0.8rem" }} className="mr-2">
				${" "}
			</span>
			<input
				ref={inputRef}
				placeholder={placeholder}
				value={input}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				className="flex-1 bg-transparent outline-none border-none caret-green-400"
				style={{ color: "#f8f8f2", fontSize: "0.8rem", caretColor: "#50fa7b" }}
				autoFocus
				spellCheck={false}
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="off"
			/>
		</div>
	);
}
