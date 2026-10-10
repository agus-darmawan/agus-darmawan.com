"use client";

import type { KeyboardEvent, Ref } from "react";
import type { Effect } from "./lib/commands";
import { complete } from "./lib/commands";
import { mkLine } from "./lib/lines";
import { useTerminalStore } from "./terminal.store";

interface TerminalInputLineProps {
	ref: Ref<HTMLInputElement>;
	prompt: string;
	label: string;
	placeholder: string;
	onEffect: (effect: Effect | undefined) => void;
}

export function TerminalInputLine({
	ref,
	prompt,
	label,
	placeholder,
	onEffect,
}: TerminalInputLineProps) {
	const input = useTerminalStore((s) => s.input);
	const setInput = useTerminalStore((s) => s.setInput);

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		const store = useTerminalStore.getState();

		if (e.key === "Enter") {
			e.preventDefault();
			onEffect(store.submit(input));
		} else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault();
			store.browseHistory(e.key === "ArrowUp" ? "up" : "down");
		} else if (e.key === "Tab" && !e.shiftKey && input.trim()) {
			// Only complete when there is something to complete — an empty
			// prompt lets Tab move focus on, so keyboard users aren't trapped.
			e.preventDefault();
			const { cwd, fs } = store;
			const result = complete(input, { cwd, fs });
			if (result.input !== undefined) setInput(result.input);
			if (result.options) {
				store.print(
					mkLine("input", `${prompt} ${input}`),
					mkLine("output", result.options.join("  ")),
				);
			}
		} else if (e.ctrlKey && e.key.toLowerCase() === "l") {
			e.preventDefault();
			store.clear();
		} else if (
			e.ctrlKey &&
			e.key.toLowerCase() === "c" &&
			!window.getSelection()?.toString()
		) {
			e.preventDefault();
			store.interrupt();
		}
	};

	return (
		<div className="flex items-center leading-5">
			<span className="text-[#4ec9b0] whitespace-nowrap">
				{prompt.replace(/\$$/, "")}
			</span>
			<span className="text-[#d4d4d4] mr-1.5">$</span>
			<input
				ref={ref}
				value={input}
				aria-label={label}
				placeholder={placeholder}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={onKeyDown}
				className="flex-1 min-w-0 bg-transparent border-0 outline-none shadow-none p-0 text-[#e6edf3] caret-[#4ec9b0] placeholder:text-[#484f58]"
				spellCheck={false}
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="off"
				enterKeyHint="send"
			/>
		</div>
	);
}
