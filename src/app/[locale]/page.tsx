"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Dock } from "@/components/dock/Dock";
import TopBar from "@/components/top-bar/TopBar";
import AboutWindow from "@/components/windows/content/about/AboutWindow";
import ExperienceWindow from "@/components/windows/content/experience/ExperienceWindow";
import ProjectsWindow from "@/components/windows/content/projects/ProjectsWindow";
import ResumeWindow from "@/components/windows/content/resume/ResumeWindow";
import TerminalWindow from "@/components/windows/content/terminal/TerminalWindow";
import { WindowFrame } from "@/components/windows/frame/WindowFrame";
import { APPS } from "@/config/apps";
import { useWindowManager } from "@/hooks/window";
import { useAppStore } from "@/store/useAppStore";
import type { WindowState } from "@/types/app";

function WindowContent({ win }: { win: WindowState }) {
	switch (win.appId) {
		case "about":
			return <AboutWindow />;
		case "resume":
			return <ResumeWindow />;
		case "experience":
			return <ExperienceWindow />;
		case "projects":
			return <ProjectsWindow />;
		case "terminal":
			return <TerminalWindow />;
		default:
			return (
				<div
					className="h-full flex items-center justify-center text-sm"
					style={{ color: "var(--text-muted)" }}
				>
					Not found
				</div>
			);
	}
}

export default function IndexPage() {
	const t = useTranslations("Windows");
	const addApp = useAppStore((s) => s.addApp);
	const removeApp = useAppStore((s) => s.removeApp);
	const setActiveApp = useAppStore((s) => s.setActiveApp);

	const {
		windows,
		activeWindow,
		dragging,
		closeWindow,
		minimizeWindow,
		toggleMaximize,
		handleDockClick,
		handleMouseDown,
		setActiveWindow,
		bringToFront,
		minimizeAllWindows,
	} = useWindowManager(t);

	useEffect(() => {
		const handler = () => minimizeAllWindows();
		window.addEventListener("minimizeAllWindows", handler);
		return () => window.removeEventListener("minimizeAllWindows", handler);
	}, [minimizeAllWindows]);

	useEffect(() => {
		windows.forEach((win) => {
			addApp({ id: win.id, name: win.title, type: "app" });
		});
	}, [windows, addApp]);

	useEffect(() => {
		setActiveApp(activeWindow);
	}, [activeWindow, setActiveApp]);

	return (
		<main className="w-full h-screen bg-ubuntu-purple overflow-hidden select-none">
			<TopBar />

			<div className="relative h-[calc(100vh-4rem)] mt-8">
				{windows.map((win) => (
					<WindowFrame
						key={win.id}
						window={win}
						isActive={activeWindow === win.id}
						isDragging={dragging === win.id}
						onMouseDown={(e) => handleMouseDown(e, win.id)}
						onClick={() => {
							setActiveWindow(win.id);
							bringToFront(win.id);
						}}
						onClose={() => {
							closeWindow(win.id);
							removeApp(win.id);
						}}
						onMinimize={() => minimizeWindow(win.id)}
						onMaximize={() => toggleMaximize(win.id)}
					>
						<WindowContent win={win} />
					</WindowFrame>
				))}
			</div>

			<Dock
				windows={windows}
				activeWindow={activeWindow}
				onIconClick={handleDockClick}
			/>
		</main>
	);
}
