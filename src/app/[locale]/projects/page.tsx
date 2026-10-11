import {
	ListingPage,
	type LocaleParams,
	listingMetadata,
} from "@/components/seo/ContentRoutes";

export const revalidate = 3600;

export const generateMetadata = (props: LocaleParams) =>
	listingMetadata("project", props);

export default function Page(props: LocaleParams) {
	return <ListingPage kind="project" {...props} />;
}
