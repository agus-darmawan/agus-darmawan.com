import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { notFoundMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	return notFoundMetadata((await params).locale);
}

// Any unknown path under a locale renders the localized not-found page
// instead of Next's bare default 404.
export default function CatchAll() {
	notFound();
}
