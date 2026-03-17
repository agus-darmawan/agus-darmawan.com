"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useTerminalState } from "./hooks/useTerminalState";
import { TerminalHintsBar } from "./TerminalHintsBar";
import { TerminalInputLine } from "./TerminalInputLine";
import { TerminalOutput } from "./TerminalOutput";
import { VimEditor } from "./VimEditor";

export default function TerminalWindow() {
	const t = useTranslations("TerminalWindow");

	const {
		lines,
		input,
		setInput,
		cwd,
		history,
		fs,
		vim,
		setVim,
		inputRef,
		bottomRef,
		addOutputLine,
		clearTerminal,
		handleVimClose,
		handleSubmit,
		handleHistoryUp,
		handleHistoryDown,
	} = useTerminalState({
		welcomeMsg: t("welcome"),
		helpHint: t("helpHint"),
		sessionClosedMsg: t("sessionClosed"),
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: ref is mutable and should not trigger scroll
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [lines]);

	useEffect(() => {
		if (!vim.active) inputRef.current?.focus();
	}, [vim.active, inputRef]);

	const hints = [
		{ key: t("hintTab"), desc: t("hintTabDesc") },
		{ key: t("hintArrows"), desc: t("hintArrowsDesc") },
		{ key: t("hintClear"), desc: t("hintClearDesc") },
	];

	const vimHints = [
		{ key: t("vimInsert"), desc: t("vimInsertDesc") },
		{ key: t("vimEsc"), desc: t("vimEscDesc") },
		{ key: t("vimSave"), desc: t("vimSaveDesc") },
		{ key: t("vimQuit"), desc: t("vimQuitDesc") },
		{ key: t("vimSaveQuit"), desc: t("vimSaveQuitDesc") },
	];

	if (vim.active) {
		return (
			<VimEditor
				vim={vim}
				setVim={setVim}
				cwd={cwd}
				setFs={() => {}}
				onClose={handleVimClose}
				hints={vimHints}
			/>
		);
	}

	return (
		<div
			role="application"
			aria-label="Terminal"
			className="h-full flex flex-col font-mono text-sm"
			// Terminal selalu dark — sama seperti real terminal di semua OS
			style={{ background: "#0d1117", color: "#e6edf3" }}
			onClick={() => inputRef.current?.focus()}
		>
			<div
				role="log"
				aria-live="polite"
				aria-label="Terminal output"
				className="flex-1 overflow-y-auto p-3 space-y-0.5"
			>
				<TerminalOutput lines={lines} />

				<TerminalInputLine
					inputRef={inputRef}
					input={input}
					cwd={cwd}
					history={history}
					fs={fs}
					placeholder={t("placeholder")}
					onChange={setInput}
					onSubmit={handleSubmit}
					onHistoryUp={handleHistoryUp}
					onHistoryDown={handleHistoryDown}
					onClear={clearTerminal}
					onAddLines={addOutputLine}
				/>

				<div ref={bottomRef} />
			</div>

			<TerminalHintsBar hints={hints} />
		</div>
	);
}
