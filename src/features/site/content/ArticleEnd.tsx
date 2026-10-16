import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { accentStyle } from "@/components/content/primitives";
import { LikeButton } from "@/components/content/stats/ItemStats";
import { Link } from "@/i18n/navigation";
import { listingPath } from "@/lib/content/paths";
import type { ContentMeta } from "@/lib/content/types";
import { itemKey } from "@/lib/meta/keys";
import { buttonClass } from "../button";

/** After the last paragraph: like it, or go back to the list. */
export function ArticleEnd({ item }: { item: ContentMeta }) {
	const t = useTranslations("Content");

	return (
		<div
			style={accentStyle(item.color)}
			className="mt-14 flex max-w-[37.5rem] flex-wrap items-center justify-between gap-4 border-t border-(--site-line) pt-8"
		>
			<LikeButton item={itemKey(item)} />
			<Link
				href={listingPath(item.kind)}
				className={buttonClass("secondary", "ml-auto")}
			>
				<ArrowLeft aria-hidden="true" className="size-4" />
				{t(item.kind === "project" ? "backToProjects" : "backToBlog")}
			</Link>
		</div>
	);
}
