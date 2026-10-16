import {
	Info,
	Lightbulb,
	MessageSquareWarning,
	OctagonAlert,
	TriangleAlert,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { CalloutKind } from "@/lib/markdown/types";

const ICONS = {
	note: Info,
	tip: Lightbulb,
	important: MessageSquareWarning,
	warning: TriangleAlert,
	caution: OctagonAlert,
} satisfies Record<CalloutKind, unknown>;

const isKind = (kind: string | undefined): kind is CalloutKind =>
	kind !== undefined && kind in ICONS;

/** GitHub-style alert (`> [!NOTE]`), titled in the reader's language. */
export function Callout({
	kind: requested,
	children,
}: {
	kind?: string;
	children: ReactNode;
}) {
	const t = useTranslations("Content.callout");
	const kind = isKind(requested) ? requested : "note";
	const Icon = ICONS[kind];

	return (
		<div className="md-callout" data-kind={kind}>
			<p className="md-callout-title">
				<Icon aria-hidden />
				{t(kind)}
			</p>
			{children}
		</div>
	);
}
