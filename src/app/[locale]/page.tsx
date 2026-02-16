"use client";

import { Dock } from "@/components/dock/Dock";
import TopBar from "@/components/top-bar/TopBar";
import AboutWindow from "@/components/windows/content/AboutWindow";
import ExperienceWindow from "@/components/windows/content/ExperienceWindow";
import ProjectsWindow from "@/components/windows/content/ProjectsWindow";
import ResumeWindow from "@/components/windows/content/ResumeWindow";
import { WindowFrame } from "@/components/windows/frame/WindowFrame";
import { useWindowManager } from "@/hooks/useWindowManager";
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
		default:
			return (
				<div className="h-full flex items-center justify-center text-(--text-muted)]">
					Not found
				</div>
			);
	}
}

export default function IndexPage() {
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
	} = useWindowManager();

	return (
		<main className="w-full h-screen bg-ubuntu-purple overflow-hidden select-none">
			<TopBar />

			<div className="relative h-[calc(100vh-6rem)] mt-8">
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
						onClose={() => closeWindow(win.id)}
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
