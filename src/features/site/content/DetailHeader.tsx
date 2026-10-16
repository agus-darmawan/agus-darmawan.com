import { Banner } from "@/components/content/banner/Banner";
import {
	ContentLinks,
	useMetaLabels,
} from "@/components/content/ContentHeader";
import { accentStyle, MetaRow } from "@/components/content/primitives";
import { ItemStats } from "@/components/content/stats/ItemStats";
import type { ContentMeta } from "@/lib/content/types";
import { itemKey } from "@/lib/meta/keys";
import { cn } from "@/lib/utils";
import { LEDE } from "../typography";

/** Top of a project or post page: banner, title, summary, facts, links. */
export function DetailHeader({ item }: { item: ContentMeta }) {
	const labels = useMetaLabels(item, "long", true);

	return (
		<header style={accentStyle(item.color)} className="pt-5">
			<Banner
				item={item}
				aspect={2}
				boxClassName="aspect-[2/1] sm:aspect-[5/2] lg:aspect-[3/1]"
				sizes="(min-width: 72rem) 70rem, 100vw"
				preload
				className="rounded-xl"
			/>
			<div className="max-w-[46rem] pb-10 pt-8 sm:pt-10">
				<h1 className="text-[clamp(1.875rem,3.4vw,2.625rem)] font-light leading-[1.12] tracking-[-0.02em] text-balance text-(--site-ink)">
					{item.title}
				</h1>
				<p className={cn(LEDE, "mt-4 text-pretty")}>{item.description}</p>
				<MetaRow
					dateIso={item.date}
					labels={labels}
					className="mt-5 gap-x-5 gap-y-2 text-[0.8125rem] [&_svg]:size-3.5"
				>
					<ItemStats item={itemKey(item)} />
				</MetaRow>
				{item.tags.length > 0 && (
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
				)}
				{item.kind === "project" && (item.repoUrl || item.demo) && (
					<div className="mt-6">
						<ContentLinks item={item} size="lg" />
					</div>
				)}
			</div>
		</header>
	);
}
