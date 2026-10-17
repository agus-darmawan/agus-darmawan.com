import { GitFork, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { GithubIcon } from "@/features/icons/BrandIcons";

/** `::github{repo="owner/name"}`: the repo with its live description and stars. */
export function RepoCard({
	repo,
	url,
	description,
	language,
	stars,
	forks,
}: {
	repo?: string;
	url?: string;
	description?: string;
	language?: string;
	stars?: string;
	forks?: string;
}) {
	const t = useTranslations("Content");
	if (!repo || !url) return null;
	const [owner, name] = repo.split("/");
	const starCount = Number(stars);
	const forkCount = Number(forks);

	return (
		<a href={url} target="_blank" rel="noopener noreferrer" className="md-repo">
			<GithubIcon size={20} aria-hidden="true" className="md-repo-icon" />
			<span className="md-repo-body">
				<span className="md-repo-name">
					<span className="md-repo-owner">{owner}/</span>
					{name}
				</span>
				{description && <span className="md-repo-text">{description}</span>}
				<span className="md-repo-facts">
					{language && <span>{language}</span>}
					{stars !== undefined && (
						<span>
							<Star aria-hidden="true" />
							{t("stars", { count: starCount })}
						</span>
					)}
					{forks !== undefined && forkCount > 0 && (
						<span>
							<GitFork aria-hidden="true" />
							{t("forks", { count: forkCount })}
						</span>
					)}
				</span>
			</span>
		</a>
	);
}
