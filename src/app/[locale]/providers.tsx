"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { TIME_ZONE } from "@/i18n/routing";

interface ProvidersProps {
	children: React.ReactNode;
	locale: string;
	messages: AbstractIntlMessages;
}

const makeQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: { refetchOnWindowFocus: false, staleTime: 30_000, retry: 1 },
		},
	});

let browserQueryClient: QueryClient | undefined;

/**
 * One client per browser tab. This provider lives under `[locale]`, so a
 * language switch remounts it — a `useState` client threw the whole query
 * cache away (Spotify, ping, content) on every switch.
 */
function getQueryClient() {
	if (typeof window === "undefined") return makeQueryClient();
	browserQueryClient ??= makeQueryClient();
	return browserQueryClient;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<NextIntlClientProvider
				locale={locale}
				messages={messages}
				timeZone={TIME_ZONE}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem={false}
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</NextIntlClientProvider>

			{process.env.NODE_ENV === "development" && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
		</QueryClientProvider>
	);
}
