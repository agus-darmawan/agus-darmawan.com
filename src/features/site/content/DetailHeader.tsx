import {
	ContentLinks,
	useMetaLabels,
} from "@/components/content/ContentHeader";
import { accentStyle, MetaRow } from "@/components/content/primitives";
import type { ContentMeta } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { LEDE } from "../typography";

/** Title block of a project or post page. */
export function DetailHeader({ item }: { item: ContentMeta }) {
	const labels = useMetaLabels(item, "long");

	return (
		<header style={accentStyle(item.color)} className="max-w-3xl pb-8 pt-6">
			<span
				aria-hidden="true"
				className="grid size-14 place-items-center rounded-2xl bg-(--accent)/12 text-2xl"
			>
				{item.emoji}
			</span>
			<h1 className="mt-5 text-[clamp(1.75rem,3.2vw,2.375rem)] font-light leading-[1.15] tracking-[-0.015em] text-(--site-ink)">
				{item.title}
			</h1>
			<p className={cn(LEDE, "mt-3")}>{item.description}</p>
			<MetaRow
				dateIso={item.date}
				labels={labels}
				className="mt-4 gap-4 text-[0.8125rem] [&_svg]:size-3.5"
			/>
			<ul className="mt-4 flex flex-wrap gap-1.5">
				{item.tags.map((tag) => (
					<li
						key={tag}
						className="rounded-md bg-(--site-raised) px-2 py-0.5 text-xs text-(--site-muted)"
					>
						{tag}
					</li>
				))}
			</ul>
			{item.kind === "project" && (item.repoUrl || item.demo) && (
				<div className="mt-6">
					<ContentLinks item={item} size="lg" />
				</div>
			)}
		</header>
	);
}
