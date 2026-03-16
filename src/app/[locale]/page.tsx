"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Dock } from "@/components/dock/Dock";
import TopBar from "@/components/top-bar/TopBar";
import ExperienceWindow from "@/components/windows/content/experience/ExperienceWindow";
import ProjectsWindow from "@/components/windows/content/projects/ProjectsWindow";
import type { ProjectMeta } from "@/components/windows/content/projects/projectsData";
import ReadmeWindow from "@/components/windows/content/projects/readme/ReadmeWindow";
import { WindowFrame } from "@/components/windows/frame/WindowFrame";
import AboutWindow from "@/features/about/AboutWindow";
import ContactWindow from "@/features/contact/ContactWindow";
import ResumeWindow from "@/features/resume/ResumeWindow";
import TerminalWindow from "@/features/terminal/TerminalWindow";
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

	const handleOpenReadme = useCallback(
		(project: ProjectMeta, name: string, desc: string, readmeFile: string) => {
			openWindow(`readme-${project.id}`, { project, name, desc, readmeFile });
		},
		[openWindow],
	);

	// README windows always sit visually above all other windows.
	// +500 offset ensures they can never be buried under Projects.
	const effectiveZ = (win: WindowState): number =>
		win.appId.startsWith("readme-") ? win.zIndex + 500 : win.zIndex;

	// True when there's at least one non-minimized README open
	const hasOpenReadme = windows.some(
		(w) => w.appId.startsWith("readme-") && !w.minimized,
	);

	return (
		<main className="w-full h-screen bg-ubuntu-purple overflow-hidden select-none">
			<TopBar />

			<div className="relative h-[calc(100vh-4rem)] mt-8">
				{windows.map((win) => {
					// Projects window is locked (can't close) while any README is open
					const closeLocked = win.appId === "projects" && hasOpenReadme;

					return (
						<WindowFrame
							key={win.id}
							window={{ ...win, zIndex: effectiveZ(win) }}
							isActive={activeWindow === win.id}
							isDragging={dragging === win.id}
							onMouseDown={(e) => handleMouseDown(e, win.id)}
							onClick={() => {
								setActiveWindow(win.id);
								bringToFront(win.id);
							}}
							onClose={() => {
								if (closeLocked) {
									// Flash all open README windows to hint the user
									windows
										.filter(
											(w) => w.appId.startsWith("readme-") && !w.minimized,
										)
										.forEach((w) => bringToFront(w.id));
									return;
								}
								closeWindow(win.id);
								removeApp(win.id);
							}}
							onMinimize={() => minimizeWindow(win.id)}
							onMaximize={() => toggleMaximize(win.id)}
							closeLocked={closeLocked}
						>
							<WindowContent win={win} onOpenReadme={handleOpenReadme} />
						</WindowFrame>
					);
				})}
			</div>

			<Dock
				windows={windows}
				activeWindow={activeWindow}
				onIconClick={handleDockClick}
			/>
		</main>
	);
}
