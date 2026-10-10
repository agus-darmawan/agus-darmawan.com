"use client";

import { ContentDetail } from "@/components/content/ContentDetail";
import { useContent } from "@/components/content/ContentProvider";

/** A project's README in its own desktop window. */
export default function ProjectWindow({ slug }: { slug: string }) {
	const { projects } = useContent();
	const project = projects.find((p) => p.slug === slug);

	if (!project) {
		return (
			<div className="h-full flex items-center justify-center text-sm text-(--text-muted)">
				404
			</div>
		);
	}

	return <ContentDetail item={project} />;
}
