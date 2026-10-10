"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { prompt } from "./lib/lines";
import { TerminalHintsBar } from "./TerminalHintsBar";
import { TerminalInputLine } from "./TerminalInputLine";
import { TerminalOutput } from "./TerminalOutput";
import { useTerminalStore } from "./terminal.store";
import { useTerminalEffects } from "./useTerminalEffects";
import { VimEditor } from "./VimEditor";

export default function TerminalWindow() {
	const t = useTranslations("TerminalWindow");
	const lines = useTerminalStore((s) => s.lines);
	const cwd = useTerminalStore((s) => s.cwd);
	const showWelcome = useTerminalStore((s) => s.showWelcome);
	const vimOpen = useTerminalStore((s) => s.vim !== null);
	const applyEffect = useTerminalEffects();

	const scrollRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Scroll the log itself — `scrollIntoView` scrolled every ancestor too and
	// shifted the whole desktop on some browsers.
	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run when lines change
	useEffect(() => {
		const el = scrollRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [lines, vimOpen]);

	useEffect(() => {
		if (!vimOpen) inputRef.current?.focus({ preventScroll: true });
	}, [vimOpen]);

	if (vimOpen) {
		return (
			<VimEditor
				label={t("vimLabel")}
				hints={[
					{ key: t("vimInsert"), desc: t("vimInsertDesc") },
					{ key: t("vimEsc"), desc: t("vimEscDesc") },
					{ key: t("vimSave"), desc: t("vimSaveDesc") },
					{ key: t("vimQuit"), desc: t("vimQuitDesc") },
					{ key: t("vimSaveQuit"), desc: t("vimSaveQuitDesc") },
				]}
			/>
		);
	}

	return (
		<div
			data-terminal
			className="h-full flex flex-col font-mono text-xs bg-[#0d1117] text-[#e6edf3]"
			onClick={() => {
				// Don't steal a text selection the visitor is making.
				if (!window.getSelection()?.toString()) inputRef.current?.focus();
			}}
		>
			<div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-0.5">
				<div role="log" aria-live="polite" aria-label={t("outputLabel")}>
					{showWelcome && (
						<div className="whitespace-pre-wrap leading-5 text-[#484f58]">
							{`${t("welcome")}\n${t("helpHint")}\n`}
						</div>
					)}
					<TerminalOutput lines={lines} />
				</div>

				<TerminalInputLine
					ref={inputRef}
					prompt={prompt(cwd)}
					label={t("inputLabel")}
					placeholder={t("placeholder")}
					onEffect={applyEffect}
				/>
			</div>

			<TerminalHintsBar
				hints={[
					{ key: t("hintTab"), desc: t("hintTabDesc") },
					{ key: t("hintArrows"), desc: t("hintArrowsDesc") },
					{ key: t("hintClear"), desc: t("hintClearDesc") },
				]}
			/>
		</div>
	);
}
