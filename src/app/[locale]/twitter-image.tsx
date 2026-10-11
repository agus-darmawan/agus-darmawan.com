// Twitter/X reuses the Open Graph card; a dedicated route makes Next emit a
// real per-locale `twitter:image` URL (the old hardcoded one was a 404).
import { SITE } from "@/config/site";
import { OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import OGImage from "./opengraph-image";

export const alt = `${SITE.shortName} — ${SITE.jobTitle}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default OGImage;
