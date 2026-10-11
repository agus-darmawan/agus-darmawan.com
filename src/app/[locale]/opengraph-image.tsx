import { SITE } from "@/config/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = `${SITE.name} — ${SITE.jobTitle}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OGImage() {
	return renderOgCard({
		eyebrow: "Ubuntu Portfolio",
		title: "I Wayan Agus",
		titleAccent: "Darmawan",
		subtitle: `${SITE.jobTitle} · ${SITE.location.locality}, ${SITE.location.region}`,
		tags: ["ROS2", "Robotics", "Next.js", "TypeScript", "Python", "Docker"],
	});
}
