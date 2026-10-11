import {
	ContentLinks,
	useMetaLabels,
} from "@/components/content/ContentHeader";
import { accentStyle, MetaRow } from "@/components/content/primitives";
import type { ContentMeta } from "@/lib/content/types";

/** Title block of a project or post page. */
export function DetailHeader({ item }: { item: ContentMeta }) {
	const labels = useMetaLabels(item, "long");

	return (
		<header style={accentStyle(item.color)} className="max-w-3xl pb-10 pt-8">
			<span
				aria-hidden="true"
				className="grid size-16 place-items-center rounded-2xl bg-(--accent)/12 text-3xl"
			>
				{item.emoji}
			</span>
			<h1 className="mt-6 text-[clamp(2rem,4.5vw,3rem)] font-light leading-[1.1] tracking-[-0.015em] text-(--site-ink)">
				{item.title}
			</h1>
			<p className="mt-4 text-lg leading-relaxed text-(--site-muted)">
				{item.description}
			</p>
			<MetaRow
				dateIso={item.date}
				labels={labels}
				className="mt-5 gap-4 text-sm [&_svg]:size-3.5"
			/>
			<ul className="mt-5 flex flex-wrap gap-1.5">
				{item.tags.map((tag) => (
					<li
						key={tag}
						className="rounded-md bg-(--site-raised) px-2 py-0.5 text-[0.8125rem] text-(--site-muted)"
					>
						{tag}
					</li>
				))}
			</ul>
			{item.kind === "project" && (item.repoUrl || item.demo) && (
				<div className="mt-7">
					<ContentLinks item={item} size="lg" />
				</div>
			)}
		</header>
	);
}
