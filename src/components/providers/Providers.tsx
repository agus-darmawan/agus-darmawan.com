"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { useState } from "react";

interface ProvidersProps {
	children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	// useState ensures a new QueryClient is created per request (no shared state between users)
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// Don't refetch on window focus by default globally — let each query opt in
						refetchOnWindowFocus: false,
						// Cache for 30s before considering stale
						staleTime: 30_000,
						// Retry once on failure
						retry: 1,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				disableTransitionOnChange
			>
				{children}
			</ThemeProvider>
			{process.env.NODE_ENV === "development" && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
		</QueryClientProvider>
	);
}
