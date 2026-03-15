import type { Metadata } from "next";
import { PROJECTS_META } from "@/components/windows/content/projects/projectsData";

type Props = {
	params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const meta = PROJECTS_META.find((p) => p.id === id);

	return {
		title: meta
			? `${meta.emoji} ${meta.id} — Agus Darmawan`
			: "Project — Agus Darmawan",
		description: "Project details by I Wayan Agus Darmawan",
	};
}

export default function ProjectLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
