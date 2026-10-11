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

export const generateStaticParams = ({
	params,
}: {
	params: { locale: string };
}) => detailStaticParams("blog", params.locale);

export const generateMetadata = (props: DetailParams) =>
	detailMetadata("blog", props);

export default function Page(props: DetailParams) {
	return <DetailPage kind="blog" {...props} />;
}
