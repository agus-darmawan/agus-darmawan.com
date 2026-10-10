"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { BlogMeta, ProjectMeta } from "@/lib/content/types";

interface ContentContextValue {
	projects: ProjectMeta[];
	posts: BlogMeta[];
}

const ContentContext = createContext<ContentContextValue | null>(null);

/**
 * Server-loaded content metadata, handed to the client desktop once.
 * Windows read from here instead of importing hardcoded TS arrays.
 */
export function ContentProvider({
	value,
	children,
}: {
	value: ContentContextValue;
	children: ReactNode;
}) {
	return (
		<ContentContext.Provider value={value}>{children}</ContentContext.Provider>
	);
}

export function useContent(): ContentContextValue {
	const ctx = useContext(ContentContext);
	if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
	return ctx;
}
