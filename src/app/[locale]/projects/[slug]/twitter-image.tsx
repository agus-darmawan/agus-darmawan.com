// Same card as Open Graph (see opengraph-image.tsx).
import { SITE } from "@/config/site";
import { OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import Image from "./opengraph-image";

export const alt = SITE.shortName;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default Image;
