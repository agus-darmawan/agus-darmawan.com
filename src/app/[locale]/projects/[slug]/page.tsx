import {
	DetailPage,
	type DetailParams,
	detailMetadata,
	detailStaticParams,
} from "@/components/seo/ContentRoutes";

// Prerendered at build, revalidated hourly; unknown slugs (e.g. a repo just
// tagged `portfolio`) are rendered on demand.
export const revalidate = 3600;
export const dynamicParams = true;

export const generateStaticParams = () => detailStaticParams("project");

export const generateMetadata = (props: DetailParams) =>
	detailMetadata("project", props);

export default function Page(props: DetailParams) {
	return <DetailPage kind="project" {...props} />;
}
