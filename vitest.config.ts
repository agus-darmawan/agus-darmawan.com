import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		// Playwright owns e2e/; vitest only runs unit tests.
		include: ["src/**/*.test.ts"],
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
			"server-only": resolve(__dirname, "./src/test/server-only.ts"),
		},
	},
});
