export interface ApiResponse<T> {
	success: boolean;
	data: T | null;
	/** Human-readable (English) error, for logs and API consumers. */
	error?: string;
	/** Machine-readable error code — the UI translates this, not `error`. */
	code?: string;
}
