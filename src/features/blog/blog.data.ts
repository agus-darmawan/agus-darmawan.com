// src/features/blog/blog.data.ts
import type { BlogPost } from "./types/blog.types";

export const BLOG_POSTS: BlogPost[] = [
	{
		slug: "building-ubuntu-portfolio",
		i18nKey: "buildingUbuntuPortfolio",
		date: "2025-03-16",
		readTime: 8,
		tags: ["Next.js", "TypeScript", "Portfolio"],
		published: true,
		color: "#e95420",
		emoji: "🖥️",
	},
];
