"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useTerminalState } from "@/hooks/terminal/useTerminalState";
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

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [bottomRef]);

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
			className="h-full flex flex-col bg-neutral-950 text-zinc-200 font-mono text-sm"
			onClick={() => inputRef.current?.focus()}
		>
			<div className="flex-1 overflow-y-auto p-3 space-y-0.5">
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
