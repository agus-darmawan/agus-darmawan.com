"use client";

import { AboutContent } from "./AboutContent";

export default function AboutWindow() {
	return (
		<div className="h-full overflow-auto bg-(--window-bg) text-(--text-primary)">
			<AboutContent />
		</div>
	);
}
