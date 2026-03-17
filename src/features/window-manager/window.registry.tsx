// src/features/window-manager/window.registry.tsx
"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const WINDOW_REGISTRY: Record<string, ComponentType> = {
	about: dynamic(() => import("@/features/about/AboutWindow")),
	terminal: dynamic(() => import("@/features/terminal/TerminalWindow")),
	resume: dynamic(() => import("@/features/resume/ResumeWindow")),
	experience: dynamic(() => import("@/features/experience/ExperienceWindow")),
	projects: dynamic(() => import("@/features/projects/ProjectsWindow")),
	blog: dynamic(() => import("@/features/blog/BlogWindow")),
	contact: dynamic(() => import("@/features/contact/ContactWindow")),
};

export function getWindowComponent(appId: string): ComponentType | null {
	return WINDOW_REGISTRY[appId] ?? null;
}
