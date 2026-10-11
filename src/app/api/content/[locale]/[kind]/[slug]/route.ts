import { NextResponse } from "next/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import {
	type ContentKind,
	getPostsWithBody,
	getProjectsWithBody,
} from "@/lib/content";
import type { ApiResponse } from "@/types/api";

/**
 * Body of a single project/post for the desktop windows. Metadata is already
 * server-rendered into the page; bodies are fetched lazily so the initial HTML
 * stays small. Statically generated + revalidated hourly (GitHub stats).
 */
export const revalidate = 3600;

type Params = { locale: string; kind: string; slug: string };

const KINDS: ContentKind[] = ["project", "blog"];

const load = (kind: ContentKind, locale: string) =>
	kind === "project" ? getProjectsWithBody(locale) : getPostsWithBody(locale);

export async function generateStaticParams(): Promise<Params[]> {
	const params = await Promise.all(
		routing.locales.flatMap((locale) =>
			KINDS.map(async (kind) =>
				(await load(kind, locale)).map(({ slug }) => ({ locale, kind, slug })),
			),
		),
	);
	return params.flat();
}

export async function GET(
	_req: Request,
	{ params }: { params: Promise<Params> },
) {
	const { locale, kind, slug } = await params;

	if (
		!hasLocale(routing.locales, locale) ||
		!KINDS.includes(kind as ContentKind)
	) {
		return NextResponse.json<ApiResponse<null>>(
			{ success: false, data: null, error: "Not found" },
			{ status: 404 },
		);
	}

	const entry = (await load(kind as ContentKind, locale)).find(
		(e) => e.slug === slug,
	);

	if (!entry) {
		return NextResponse.json<ApiResponse<null>>(
			{ success: false, data: null, error: "Not found" },
			{ status: 404 },
		);
	}

	return NextResponse.json<ApiResponse<{ body: string }>>({
		success: true,
		data: { body: entry.body },
	});
}
