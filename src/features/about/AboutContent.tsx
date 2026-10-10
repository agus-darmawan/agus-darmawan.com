import { AboutAwards } from "./AboutAwards";
import { AboutEducation } from "./AboutEducation";
import { AboutHeader } from "./AboutHeader";
import { AboutPublications } from "./AboutPublications";
import { AboutSkills } from "./AboutSkills";

/**
 * Everything in the About window. Rendered client-side inside the desktop
 * and server-side on /about (these sections have no client-only hooks).
 */
export function AboutContent({ children }: { children?: React.ReactNode }) {
	return (
		<>
			<AboutHeader />
			<AboutSkills />
			{children}
			<AboutEducation />
			<AboutAwards />
			<AboutPublications />
		</>
	);
}
