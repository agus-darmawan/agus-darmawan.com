// src/features/blog/blog.types.ts

export interface BlogPost {
	slug: string;
	i18nKey: string;
	date: string;
	readTime: number;
	tags: string[];
	published: boolean;
	color: string;
	emoji: string;
}
