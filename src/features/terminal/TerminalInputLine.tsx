"use client";

import { type RefObject, useCallback } from "react";
import type { FSNode } from "./types/terminal.types";

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

/** Returns immediate subdirectory names under cwd */
function getSubdirs(fs: FSNode, cwd: string): string[] {
	const prefix = cwd.endsWith("/") ? cwd : `${cwd}/`;
	const result: string[] = [];

	for (const key of Object.keys(fs)) {
		if (key === cwd) continue;
		if (!key.startsWith(prefix)) continue;

		const rest = key.slice(prefix.length);

		if (rest.length > 0 && !rest.includes("/")) {
			result.push(rest + "/");
		}
	}

	return result;
}

/** Context aware candidate completion */
function getCandidates(fs: FSNode, cwd: string, cmd: string): string[] {
	const files = Object.keys(fs[cwd] ?? {});
	const dirs = getSubdirs(fs, cwd);

	if (cmd === "cd") return dirs;
	if (["vim", "nano", "cat", "rm"].includes(cmd)) return files;

	return [...files, ...dirs];
}

const COMMANDS = [
	"ls",
	"cd",
	"pwd",
	"cat",
	"touch",
	"mkdir",
	"rm",
	"echo",
	"vim",
	"nano",
	"git",
	"neofetch",
	"cowsay",
	"fortune",
	"cal",
	"history",
	"clear",
	"whoami",
	"date",
	"uname",
	"uptime",
	"exit",
	"help",
];

export function TerminalInputLine({
	inputRef,
	input,
	cwd,
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

				const trimmed = input.trimStart();
				const parts = trimmed.split(/\s+/);

				const cmd = parts[0] ?? "";
				const partial = parts[parts.length - 1] ?? "";

				if (parts.length <= 1) {
					const matches = COMMANDS.filter((c) => c.startsWith(partial));

					if (matches.length === 1) {
						onChange(matches[0] + " ");
					} else if (matches.length > 1) {
						onAddLines(matches.join("  "));
					}

					return;
				}

				const candidates = getCandidates(fs, cwd, cmd);

				const matches = candidates.filter((c) => c.startsWith(partial));

				if (matches.length === 1) {
					const newParts = [...parts];
					newParts[newParts.length - 1] = matches[0];
					onChange(newParts.join(" "));
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
		<div className="flex items-center text-xs font-mono leading-[1.4]">
			<span className="text-green-400">darm@wan:</span>

			<span className="text-cyan-300">{cwd}</span>

			<span className="text-gray-300 mr-2">$</span>

			<input
				ref={inputRef}
				value={input}
				placeholder={placeholder}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				className="flex-1 bg-transparent outline-none border-none text-gray-100 caret-green-400 placeholder-gray-500"
				autoFocus
				spellCheck={false}
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="off"
			/>
		</div>
	);
}
