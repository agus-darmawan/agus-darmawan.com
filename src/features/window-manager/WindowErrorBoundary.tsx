"use client";

import * as Sentry from "@sentry/nextjs";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Component, type ReactNode } from "react";

interface Props {
	appId: string;
	title: string;
	retryLabel: string;
	children: ReactNode;
}

interface State {
	error: Error | null;
}

/**
 * One crashing app (a bad MDX file, a pdf.js failure…) used to take the
 * whole desktop down with it. Each window now fails on its own.
 */
export class WindowErrorBoundary extends Component<Props, State> {
	state: State = { error: null };

	static getDerivedStateFromError(error: Error): State {
		return { error };
	}

	componentDidCatch(error: Error) {
		Sentry.captureException(error, { tags: { window: this.props.appId } });
	}

	render() {
		if (!this.state.error) return this.props.children;

		return (
			<div
				role="alert"
				className="h-full flex flex-col items-center justify-center gap-3 p-6 text-center"
			>
				<TriangleAlert className="w-8 h-8 text-ubuntu-orange" aria-hidden />
				<p className="text-sm text-(--text-secondary)">{this.props.title}</p>
				<button
					type="button"
					onClick={() => this.setState({ error: null })}
					className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-(--border) hover:bg-(--surface-secondary) transition-colors"
				>
					<RotateCcw className="w-3.5 h-3.5" aria-hidden />
					{this.props.retryLabel}
				</button>
			</div>
		);
	}
}
