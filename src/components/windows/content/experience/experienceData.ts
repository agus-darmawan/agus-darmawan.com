export interface ExperienceRole {
	title: string;
	period: { start: string; end: string | null };
	responsibilities: string[];
	tech: string[];
}

export interface ExperienceEntry {
	company: string;
	location: string;
	color: string;
	/** Path relative to /public, e.g. "/companies/techcorp.png" */
	logo: string;
	roles: ExperienceRole[];
}

export const EXPERIENCES: ExperienceEntry[] = [
	{
		company: "TechCorp Indonesia",
		location: "Denpasar, Bali",
		color: "#e95420",
		logo: "/companies/techcorp.png",
		roles: [
			{
				title: "Senior Frontend Developer",
				period: { start: "Jul 2024", end: null },
				responsibilities: [
					"Architected micro-frontend system serving 500k+ monthly active users with zero-downtime deployments",
					"Led a team of 5 engineers, conducting design reviews and mentoring junior developers",
					"Drove Core Web Vitals improvements: LCP reduced from 4.2s to 1.1s across all products",
				],
				tech: ["Next.js", "TypeScript", "Micro-frontends", "AWS", "Turborepo"],
			},
			{
				title: "Frontend Developer",
				period: { start: "Jan 2023", end: "Jun 2024" },
				responsibilities: [
					"Led migration of legacy jQuery codebase to Next.js 14, reducing initial load time by 60%",
					"Designed and built a reusable component library with Storybook, adopted across 3 product teams",
					"Introduced unit and integration testing with Jest, raising coverage from 5% to 72%",
					"Collaborated with designers to implement pixel-perfect UIs with WCAG 2.1 AA compliance",
				],
				tech: [
					"Next.js",
					"TypeScript",
					"Tailwind CSS",
					"Storybook",
					"Jest",
					"PostgreSQL",
				],
			},
		],
	},
	{
		company: "StartupXYZ",
		location: "Remote",
		color: "#3b82f6",
		logo: "/companies/startupxyz.png",
		roles: [
			{
				title: "Full-stack Developer",
				period: { start: "Jun 2022", end: "Dec 2022" },
				responsibilities: [
					"Developed RESTful APIs using Express.js and PostgreSQL for a SaaS B2B platform",
					"Implemented real-time collaboration features using WebSocket and Redis pub/sub",
					"Optimized complex SQL queries, reducing average API response time from 800ms to 95ms",
					"Integrated Stripe, Twilio SMS, and SendGrid across the product",
				],
				tech: [
					"Express.js",
					"PostgreSQL",
					"Redis",
					"WebSocket",
					"Stripe",
					"Docker",
				],
			},
		],
	},
	{
		company: "Self-Employed",
		location: "Bali, Indonesia",
		color: "#10b981",
		logo: "/companies/freelance.png",
		roles: [
			{
				title: "Freelance Web Developer",
				period: { start: "Jan 2021", end: "May 2022" },
				responsibilities: [
					"Delivered 10+ custom websites and web applications for small businesses across Bali",
					"Built e-commerce solutions with WooCommerce and custom React storefronts",
					"Worked directly with clients to gather requirements, design wireframes, and iterate",
				],
				tech: ["React", "WordPress", "WooCommerce", "PHP", "MySQL", "Figma"],
			},
		],
	},
];
