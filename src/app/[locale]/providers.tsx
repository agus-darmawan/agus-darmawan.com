"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { TIME_ZONE } from "@/i18n/routing";

interface ProvidersProps {
	children: React.ReactNode;
	locale: string;
	messages: Record<string, string>;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						staleTime: 30_000,
						retry: 1,
					},
				},
			}),
	);

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
