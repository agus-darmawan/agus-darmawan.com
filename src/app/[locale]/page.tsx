"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Dock } from "@/components/dock/Dock";
import TopBar from "@/components/top-bar/TopBar";
import AboutWindow from "@/components/windows/content/about/AboutWindow";
import ContactWindow from "@/components/windows/content/contact/ContactWindow";
import ExperienceWindow from "@/components/windows/content/experience/ExperienceWindow";
import ProjectsWindow from "@/components/windows/content/projects/ProjectsWindow";
import type { ProjectMeta } from "@/components/windows/content/projects/projectsData";
import ReadmeWindow from "@/components/windows/content/readme/ReadmeWindow";
import ResumeWindow from "@/components/windows/content/resume/ResumeWindow";
import TerminalWindow from "@/components/windows/content/terminal/TerminalWindow";
import { WindowFrame } from "@/components/windows/frame/WindowFrame";
import { APPS } from "@/config/apps";
import { useWindowManager } from "@/hooks/window";
import { useAppStore } from "@/store/useAppStore";
import type { WindowState } from "@/types/app";

function WindowContent({
	win,
	onOpenReadme,
}: {
	win: WindowState;
	onOpenReadme: (
		project: ProjectMeta,
		name: string,
		desc: string,
		readmeFile: string,
	) => void;
}) {
	switch (win.appId) {
		case "about":
			return <AboutWindow />;
		case "resume":
			return <ResumeWindow />;
		case "experience":
			return <ExperienceWindow />;
		case "projects":
			return <ProjectsWindow onOpenReadme={onOpenReadme} />;
		case "terminal":
			return <TerminalWindow />;
		case "contact":
			return <ContactWindow />;
		default:
			// README windows use appId prefixed with "readme-"
			if (win.appId.startsWith("readme-") && win.data) {
				const d = win.data as {
					project: ProjectMeta;
					name: string;
					desc: string;
					readmeFile: string;
				};
				return (
					<ReadmeWindow
						project={d.project}
						name={d.name}
						desc={d.desc}
						readmeFile={d.readmeFile}
					/>
				);
			}
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
		openWindow,
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

	// Opens a dedicated README window for a project
	const handleOpenReadme = (
		project: ProjectMeta,
		name: string,
		desc: string,
		readmeFile: string,
	) => {
		const appId = `readme-${project.id}`;
		openWindow(appId, { project, name, desc, readmeFile });
	};

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
						<WindowContent win={win} onOpenReadme={handleOpenReadme} />
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
