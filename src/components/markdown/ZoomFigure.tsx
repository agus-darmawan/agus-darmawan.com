"use client";

import { Maximize2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
	Children,
	isValidElement,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";

/**
 * A figure whose image opens full size in a dialog. The image itself is the
 * button; Esc, the close button or a click outside the image closes it.
 */
export function ZoomFigure({
	src,
	alt,
	children,
}: {
	src?: string;
	alt?: string;
	children: ReactNode;
}) {
	const t = useTranslations("Content");
	const dialog = useRef<HTMLDialogElement>(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const el = dialog.current;
		if (!el) return;
		if (open && !el.open) el.showModal();
		if (!open && el.open) el.close();
	}, [open]);

	// The server sends <img> then (maybe) <figcaption>.
	const parts = Children.toArray(children);
	const image = parts.find(
		(part) => isValidElement(part) && part.type === "img",
	);
	const rest = parts.filter((part) => part !== image);
	if (!src || !image) return <figure>{children}</figure>;
	const name = alt || t("image");

	return (
		<figure className="md-zoom">
			<button
				type="button"
				aria-label={t("openImage", { alt: name })}
				aria-haspopup="dialog"
				onClick={() => setOpen(true)}
				className="md-zoom-frame"
			>
				{image}
				<span aria-hidden="true" className="md-zoom-icon">
					<Maximize2 />
				</span>
			</button>
			{rest}
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: a click on the backdrop closes it; keyboards have Esc and the close button */}
			<dialog
				ref={dialog}
				aria-label={name}
				onClose={() => setOpen(false)}
				onClick={(e) => {
					if (e.target === e.currentTarget) setOpen(false);
				}}
				className="md-zoom-dialog"
			>
				{open && (
					// biome-ignore lint/performance/noImgElement: whatever source the author used, at full size
					<img src={src} alt={alt ?? ""} className="md-zoom-image" />
				)}
				<button
					type="button"
					aria-label={t("close")}
					onClick={() => setOpen(false)}
					className="md-zoom-close"
				>
					<X aria-hidden="true" className="size-5" />
				</button>
			</dialog>
		</figure>
	);
}
