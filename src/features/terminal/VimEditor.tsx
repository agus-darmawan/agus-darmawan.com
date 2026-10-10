"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { TerminalHintsBar } from "./TerminalHintsBar";
import { useTerminalStore } from "./terminal.store";

const VISIBLE_LINES = 20;

interface VimEditorProps {
	label: string;
	hints: { key: string; desc: string }[];
}

export function VimEditor({ label, hints }: VimEditorProps) {
	const vim = useTerminalStore((s) => s.vim);
	const vimKey = useTerminalStore((s) => s.vimKey);
	const editorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		editorRef.current?.focus({ preventScroll: true });
	}, []);

	if (!vim) return null;

	const start = Math.max(
		0,
		Math.min(
			vim.cursorLine - Math.floor(VISIBLE_LINES / 2),
			vim.lines.length - VISIBLE_LINES,
		),
	);
	const visible = vim.lines.slice(start, start + VISIBLE_LINES);
	const insert = vim.mode === "insert";

	return (
		// biome-ignore lint/a11y/useSemanticElements: a modal editor drawn from state; a <textarea> can't express vim's modes and cursor
		<div
			ref={editorRef}
			role="textbox"
			aria-multiline="true"
			aria-label={`${label} — ${vim.filename}`}
			tabIndex={0}
			className="flex flex-col h-full bg-[#1a1a2e] text-gray-200 font-mono text-sm outline-none"
			onKeyDown={(e) => {
				// Normal mode lets Tab through so keyboard users can leave.
				if (e.key === "Tab" && vim.mode === "normal") return;
				e.preventDefault();
				vimKey({ key: e.key, ctrl: e.ctrlKey, meta: e.metaKey, alt: e.altKey });
			}}
		>
			<div className="flex justify-between px-3 py-1 text-xs bg-[#16213e] border-b border-[#0f3460] text-gray-400">
				<span>
					VIM — {vim.filename}
					{vim.modified && " [+]"}
				</span>
				<span className="text-pink-500 uppercase">{vim.mode}</span>
			</div>

			<div className="flex-1 overflow-hidden">
				{visible.map((line, i) => {
					const number = start + i;
					const isCursor = number === vim.cursorLine;
					return (
						<div
							key={number}
							className={cn("flex min-h-5", isCursor && "bg-white/5")}
						>
							<span
								className={cn(
									"w-10 pr-3 text-right text-xs select-none",
									isCursor ? "text-pink-500" : "text-gray-600",
								)}
							>
								{number + 1}
							</span>
							<span className="flex-1 whitespace-pre">
								{isCursor ? (
									<>
										{line.slice(0, vim.cursorCol)}
										<span
											className={cn(
												"text-black",
												insert ? "bg-pink-500" : "bg-cyan-400",
											)}
										>
											{line[vim.cursorCol] ?? " "}
										</span>
										{line.slice(vim.cursorCol + 1)}
									</>
								) : (
									line || " "
								)}
							</span>
						</div>
					);
				})}
			</div>

			<div
				aria-live="polite"
				className={cn(
					"flex justify-between px-3 py-1 text-xs",
					insert ? "bg-pink-500 text-black" : "bg-[#0f3460]",
				)}
			>
				<span>
					{vim.mode === "command" ? vim.commandBuffer : vim.statusMessage}
				</span>
				<span>
					{vim.cursorLine + 1},{vim.cursorCol + 1}
				</span>
			</div>
			<TerminalHintsBar
				hints={hints}
				className="bg-[#0a0a1a] border-[#1a1a3e] text-gray-500"
			/>
		</div>
	);
}
