import NextImage from "next/image";
import type { ContentMeta } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { accentStyle } from "../primitives";
import { TrajectoryArt } from "./TrajectoryArt";

/**
 * The image at the top of an item: its photo when the frontmatter has one,
 * otherwise the drawn route.
 *
 * The box is `aspect` wide by default. Pass `boxClassName` with aspect
 * utilities to change it per breakpoint; the drawing is made for `aspect`
 * and fills wider boxes by trimming top and bottom, so give the narrowest.
 */
export function Banner({
	item,
	aspect,
	sizes,
	preload,
	boxClassName,
	className,
}: {
	item: Pick<ContentMeta, "kind" | "slug" | "color" | "banner" | "bannerAlt">;
	aspect: number;
	/** `sizes` of the photo; the drawing has none. */
	sizes: string;
	/** The banner at the top of a page: fetch the photo first. */
	preload?: boolean;
	/** Aspect-ratio utilities that replace the default box. */
	boxClassName?: string;
	className?: string;
}) {
	return (
		<div
			style={{
				...accentStyle(item.color),
				...(boxClassName ? {} : { aspectRatio: aspect }),
			}}
			className={cn(
				"relative overflow-hidden bg-(--surface-secondary)",
				boxClassName,
				className,
			)}
		>
			{item.banner ? (
				<NextImage
					src={item.banner}
					alt={item.bannerAlt ?? ""}
					fill
					sizes={sizes}
					preload={preload}
					className="object-cover"
				/>
			) : (
				<TrajectoryArt seed={`${item.kind}/${item.slug}`} aspect={aspect} />
			)}
		</div>
	);
}
