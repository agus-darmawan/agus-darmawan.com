"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

interface GlobalErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<html lang="en">
			<body
				style={{
					margin: 0,
					background: "#0d0010",
					color: "white",
					fontFamily: "sans-serif",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "100vh",
					flexDirection: "column",
					gap: "16px",
				}}
			>
				<p style={{ fontSize: "48px", margin: 0 }}>💥</p>
				<h2 style={{ margin: 0, color: "#e95420" }}>Something went wrong</h2>
				<p style={{ margin: 0, opacity: 0.5, fontSize: "14px" }}>
					{error.digest ?? "An unexpected error occurred"}
				</p>
				<button
					type="button"
					onClick={reset}
					style={{
						marginTop: "8px",
						padding: "8px 24px",
						background: "#e95420",
						color: "white",
						border: "none",
						borderRadius: "8px",
						cursor: "pointer",
						fontSize: "14px",
					}}
				>
					Try again
				</button>
			</body>
		</html>
	);
}
