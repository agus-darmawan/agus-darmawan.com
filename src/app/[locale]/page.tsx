"use client";
import { useState } from "react";
import { Dock } from "@/components/dock/Dock";
import TopBar from "@/components/top-bar/TopBar";
import AboutWindow from "@/components/windows/content/AboutWindow";
import ExperienceWindow from "@/components/windows/content/ExperienceWindow";
import ProjectsWindow from "@/components/windows/content/ProjectsWindow";
import ResumeWindow from "@/components/windows/content/ResumeWindow";
import { WindowFrame } from "@/components/windows/frame/WindowFrame";
import { useWindowManager } from "@/hooks/useWindowManager";
// import { useTranslations } from "next-intl";
// import { setRequestLocale } from "next-intl/server";
// import { use } from "react";
import { WindowState } from "@/types/app";

export default function IndexPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	// const { locale } = use(params);

	// setRequestLocale(locale);

	// Once the request locale is set, you
	// can call hooks from `next-intl`
	// const t = useTranslations("HomePage");

	const handleIconClick = (windowId: string) => {
		setActiveWindow(windowId);
	};

	const renderWindowContent = (win: WindowState) => {
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
					<div className="h-full flex items-center justify-center">
						Not found
					</div>
				);
		}
	};

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
			<div className="w-full h-screen bg-[#77216F] overflow-hidden select-none">
				<div className="relative h-[calc(100vh-4.5rem)]">
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
							{renderWindowContent(win)}
						</WindowFrame>
					))}
				</div>
				<Dock
					windows={windows}
					activeWindow={activeWindow}
					onIconClick={handleDockClick}
				/>
			</div>
			<Dock
				windows={windows}
				activeWindow={activeWindow}
				onIconClick={handleIconClick}
			/>
		</main>
	);
}
